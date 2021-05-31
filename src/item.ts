/**
 * An item streamed from a Channel.
 */
export default interface Item {
  channel?: string;
  [x: string]: any;
}
