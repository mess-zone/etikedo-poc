import { Interval, fuse } from "./fuse"

export function blend(C: Interval, B: Interval) {
    return fuse(C, B)
}