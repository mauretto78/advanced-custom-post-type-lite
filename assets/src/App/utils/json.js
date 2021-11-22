import React from "react";
import lz from "lzutf8";

/**
 * compress a json
 *
 * @param json
 * @return {string}
 */
export const compressJson = (json) => {
    return lz.encodeBase64(lz.compress(json));
};

/**
 * decompress a json
 *
 * @param compressedJson
 * @return {string | Uint8Array | LZUTF8.Buffer}
 */
export const decompressJson = (compressedJson) => {
    return lz.decompress(lz.decodeBase64(compressedJson));
};