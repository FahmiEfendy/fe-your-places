const UNAUTHORIZED_EVENT = "auth:unauthorized";

export const emitUnauthorized = () => {
  window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
};

export const onUnauthorized = (handler) => {
  window.addEventListener(UNAUTHORIZED_EVENT, handler);
  return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
};
