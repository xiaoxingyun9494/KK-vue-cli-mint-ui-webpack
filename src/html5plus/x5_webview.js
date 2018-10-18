class X_5Webview {
    constructor() {
        this.activity = plus.android.runtimeMainActivity();
        let Intent = plus.android.importClass("android.content.Intent");
        this.intent = new Intent();
        this.intent.setClassName(this.activity, "com.activity.BrowserActivity");
    }

    open(options = {}) {
        for (let attr in options) {
            this.intent.putExtra(attr, options[attr]);
        };
        this.activity.startActivity(this.intent);
    }
};

export default function() {
    return new X_5Webview();
};
