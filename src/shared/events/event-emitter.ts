type EventMap = Record<string, unknown>;

type Listener<TPayload> = (payload: TPayload) => void;

/** 콜백이 아니라 등록 단위로 지운다. 같은 함수를 두 번 등록해도 하나만 해제된다. */
interface Registration<TPayload> {
  listener: Listener<TPayload>;
}

/**
 * payload가 `void`인 이벤트는 인자 없이 발행할 수 있게 한다.
 * `emit("something-happened")` 처럼 쓰기 위한 장치다.
 */
type EmitArgs<TPayload> = TPayload extends void ? [] : [payload: TPayload];

/**
 * 타입이 붙은 이벤트 이미터.
 *
 * FSD에서 하위 레이어는 상위를 import할 수 없다. `shared`의 인터셉터나
 * `features`의 훅이 "무슨 일이 일어났다"를 알려야 하는데 처리는 `app`에서
 * 해야 할 때, 그 제어 역전에 쓴다.
 *
 * 결과가 필요한 동작에는 쓰지 않는다. 발행하고 잊는 구조라 반환값도
 * 실패 여부도 받을 수 없다. 그런 건 콜백을 주입한다.
 *
 * @typeParam TEvents - 이벤트 이름 → payload 타입 맵
 */
export class EventEmitter<TEvents extends EventMap> {
  private registrations = new Map<
    keyof TEvents,
    Registration<TEvents[keyof TEvents]>[]
  >();

  /**
   * 구독한다.
   *
   * @returns 구독 해제 함수. 여러 번 호출해도 안전하다.
   */
  on<K extends keyof TEvents>(
    event: K,
    listener: Listener<TEvents[K]>,
  ): () => void {
    const registration = { listener } as Registration<TEvents[keyof TEvents]>;
    const list = this.registrations.get(event) ?? [];
    list.push(registration);
    this.registrations.set(event, list);

    return () => {
      const current = this.registrations.get(event);
      if (!current) return;

      const index = current.indexOf(registration);
      if (index === -1) return;

      current.splice(index, 1);
      if (current.length === 0) this.registrations.delete(event);
    };
  }

  /**
   * 발행한다.
   *
   * 리스너 하나가 throw해도 나머지는 실행되고 예외가 발행 측으로 전파되지
   * 않는다. axios 인터셉터가 구독자의 실패까지 떠안으면 안 되기 때문이다.
   * 순회 전에 목록을 복사하므로 리스너 안에서 구독·해제해도 안전하다.
   */
  emit<K extends keyof TEvents>(
    event: K,
    ...args: EmitArgs<TEvents[K]>
  ): void {
    const list = this.registrations.get(event);
    if (!list) return;

    const [payload] = args as [TEvents[K]];

    for (const { listener } of [...list]) {
      try {
        (listener as Listener<TEvents[K]>)(payload);
      } catch (error) {
        console.error(`[EventEmitter] "${String(event)}" 리스너 오류`, error);
      }
    }
  }

  /** 해당 이벤트의 구독자 수. 테스트와 누수 확인용. */
  listenerCount(event: keyof TEvents): number {
    return this.registrations.get(event)?.length ?? 0;
  }

  clear(): void {
    this.registrations.clear();
  }
}
