import {
  isBoolean,
  isNumber,
  isPlainObject,
  isString,
  isNil,
  get,
  isArray,
} from "lodash-es";
import Big from "big.js";

export const argToString = (val: unknown, moveType: string): any => {
  if (isNumber(val)) {
    return val;
  }

  if (isBig(val)) {
    return val.round(0).toString() as any;
  }

  if (isString(val)) {
    if (moveType === "address" || moveType === "&signer") {
      return val;
    }

    return val; // Buffer.from(val, "utf-8").toString("hex");
  }
  if (isBoolean(val)) {
    return val as any;
  }
  if (isPlainObject(val)) {
    return val as any;
  }

  if (moveType === "vector") {
    return (val as Array<unknown>).map(
      (e) => argToString(e, "") as string | number | boolean
    );
  }

  return val;
};

const isBig = (n: any): n is Big =>
  !isNil(get(n, "s")) && !isNil(get(n, "e")) && isArray(get(n, "c"));
