var config = module.exports;


config["My tests"] = {
    rootPath: "../",
    environment: "browser", //"browser" or "node"
    sources: [
        "src/js/js-sle-main.js",
    ],
    tests: [
        "test/tests.js"
    ]
}

