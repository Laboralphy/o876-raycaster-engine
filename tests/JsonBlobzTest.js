const JsonBlobz = require("../libs/json-blobz");

describe('#jsonblobz', function () {
    it('should work', async function () {
        const jb = new JsonBlobz();
        const data = {
            tile: [
                {
                    id: 1,
                    img: 'data:image/png;base64,xxxxxx',
                    type: 10
                }
            ]
        };
        let oBlobs;
        const r = await jb.deblob(data, function(blobs) {
            oBlobs = blobs;
            return Promise.resolve();
        });
        expect(r).toEqual({"tile":[{"id":1,"img":"594478fb3a43415a0c77accab23019da.png","type":10}]});
        expect(oBlobs['594478fb3a43415a0c77accab23019da.png']).toBeDefined();
    });

    it('should work 2', async function () {
        const jb = new JsonBlobz();
        const data = {
            tile: [
                {
                    id: 1,
                    img: 'data:image/png;base64,123456789',
                    type: 10
                }
            ],
            deep: {
                tree: {
                    obj: {
                        hidden: [
                            0, 1, 2, 3, {
                                inside: {
                                    a: {
                                        node: {
                                            img: 'data:image/jpeg;base64,123456789'
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
        let oBlobs;
        const r = await jb.deblob(data, function(blobs) {
            oBlobs = blobs;
            return Promise.resolve();
        });
        expect(r).toEqual({"tile":[{"id":1,"img":"4c5fca3ed14e45d865d31b780a7bd40c.png","type":10}],"deep":{"tree":{"obj":{"hidden":[0,1,2,3,{"inside":{"a":{"node":{"img":"4c5fca3ed14e45d865d31b780a7bd40c.jpg"}}}}]}}}});
        expect(oBlobs['4c5fca3ed14e45d865d31b780a7bd40c.png']).toBeDefined();
        expect(oBlobs['4c5fca3ed14e45d865d31b780a7bd40c.jpg']).toBeDefined();
    });



    it('should work 3', async function () {
        const jb = new JsonBlobz();
        const data = {
            tile: [
                {
                    id: 1,
                    img: 'data:image/png;base64,12345678',
                    type: 10
                }
            ],
            deep: {
                tree: {
                    obj: {
                        hidden: [
                            0, 1, 2, 3, {
                                inside: {
                                    a: {
                                        node: {
                                            img: 'data:image/jpeg;base64,12345678'
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
        let oBlobs;
        const r = await jb.deblob(data, function(blobs) {
            oBlobs = blobs;
            return Promise.resolve();
        });

        const r2 = await jb.reblob(r, function (blobs) {
            return oBlobs;
        });

        expect(r2).toEqual(data);
    });

    it('should walk', function() {
        const jb = new JsonBlobz();
        const data = {
            foo: {
                bar: {
                    a: 1,
                    b: null,
                    c: [
                        {
                            x: 10,
                            y: 8,
                        },
                        {
                            x: 15,
                            y: 4,
                        },
                        {
                            x: 7,
                            y: 887,
                        },
                        {
                            x: -40,
                            y: 12,
                        },
                    ],
                    d: 'foobar'
                }
            }
        };
        const d2 = jb.walk(data, (k, v) => {
            if (k === 'x' && v > 10) {
                return -v;
            } else {
                return v;
            }
        });
        expect(d2).toEqual({
            foo: {
                bar: {
                    a: 1,
                    b: null,
                    c: [
                        {
                            x: 10,
                            y: 8,
                        },
                        {
                            x: -15,
                            y: 4,
                        },
                        {
                            x: 7,
                            y: 887,
                        },
                        {
                            x: -40,
                            y: 12,
                        },
                    ],
                    d: 'foobar'
                }
            }
        });
    });
});
