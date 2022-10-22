export = StreamInjecter;
declare class StreamInjecter {
    constructor(option: any);
    matchRegExp: any;
    injectString: any;
    replaceString: any;
    ignoreString: any;
    memoryBuffer: string;
    _transform(chunk: any, encoding: any, cb: any): void;
    _flush(cb: any): void;
}
