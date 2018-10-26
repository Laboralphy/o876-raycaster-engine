export const SCHEMA_WORLD = {
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/root.json",
    "type": "object",
    "title": "The Root Schema",
    "required": [
        "metrics",
        "camera",
        "visual",
        "doubleHeight"
    ],
    "properties": {
        "metrics": {
            "$id": "#/properties/metrics",
            "type": "object",
            "title": "Various measurements of cells and surface sizes",
            "required": [
                "spacing"
            ],
            "properties": {
                "spacing": {
                    "$id": "#/properties/metrics/properties/spacing",
                    "type": "integer",
                    "title": "Size of cells",
                    "default": 0,
                    "examples": [
                        0
                    ]
                }
            }
        },
        "camera": {
            "$id": "#/properties/camera",
            "type": "object",
            "title": "The Camera Schema",
            "required": [
                "height",
                "width",
                "angle"
            ],
            "properties": {
                "height": {
                    "$id": "#/properties/camera/properties/height",
                    "type": "integer",
                    "title": "The Height Schema",
                    "default": 0,
                    "examples": [
                        0
                    ]
                },
                "width": {
                    "$id": "#/properties/camera/properties/width",
                    "type": "integer",
                    "title": "The Width Schema",
                    "default": 0,
                    "examples": [
                        0
                    ]
                },
                "angle": {
                    "$id": "#/properties/camera/properties/angle",
                    "type": "number",
                    "title": "The Angle Schema",
                    "default": 0.0,
                    "examples": [
                        0.7853981633974483
                    ]
                }
            }
        },
        "visual": {
            "$id": "#/properties/visual",
            "type": "object",
            "title": "The Visual Schema",
            "required": [
                "fog",
                "filter",
                "brightness",
                "shading"
            ],
            "properties": {
                "fog": {
                    "$id": "#/properties/visual/properties/fog",
                    "type": "object",
                    "title": "The Fog Schema",
                    "required": [
                        "color",
                        "distance"
                    ],
                    "properties": {
                        "color": {
                            "$id": "#/properties/visual/properties/fog/properties/color",
                            "type": "string",
                            "title": "The Color Schema",
                            "default": "",
                            "examples": [
                                "black"
                            ],
                            "pattern": "^(.*)$"
                        },
                        "distance": {
                            "$id": "#/properties/visual/properties/fog/properties/distance",
                            "type": "integer",
                            "title": "The Distance Schema",
                            "default": 0,
                            "examples": [
                                100
                            ]
                        }
                    }
                },
                "filter": {
                    "$id": "#/properties/visual/properties/filter",
                    "type": "boolean",
                    "title": "The Filter Schema",
                    "default": false,
                    "examples": [
                        false
                    ]
                },
                "brightness": {
                    "$id": "#/properties/visual/properties/brightness",
                    "type": "integer",
                    "title": "The Brightness Schema",
                    "default": 0,
                    "examples": [
                        0
                    ]
                },
                "shading": {
                    "$id": "#/properties/visual/properties/shading",
                    "type": "object",
                    "title": "The Shading Schema",
                    "required": [
                        "factor",
                        "threshold",
                        "dim"
                    ],
                    "properties": {
                        "factor": {
                            "$id": "#/properties/visual/properties/shading/properties/factor",
                            "type": "integer",
                            "title": "The Factor Schema",
                            "default": 0,
                            "examples": [
                                50
                            ]
                        },
                        "threshold": {
                            "$id": "#/properties/visual/properties/shading/properties/threshold",
                            "type": "integer",
                            "title": "The Threshold Schema",
                            "default": 0,
                            "examples": [
                                16
                            ]
                        },
                        "dim": {
                            "$id": "#/properties/visual/properties/shading/properties/dim",
                            "type": "integer",
                            "title": "The Dim Schema",
                            "default": 0,
                            "examples": [
                                7
                            ]
                        }
                    }
                }
            }
        },
        "doubleHeight": {
            "$id": "#/properties/doubleHeight",
            "type": "boolean",
            "title": "The Doubleheight Schema",
            "default": false,
            "examples": [
                false
            ]
        }
    }
};