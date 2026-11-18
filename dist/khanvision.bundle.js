(function(){'use strict';class PageObserver {
    constructor(callback) {
        this.callback = callback;
        this.observer = null;
        this.timer = null;
    }

    start() {
        if (this.observer || !document.body) return;

        this.observer = new MutationObserver(() => {
            this.schedule();
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });

        this.schedule();
    }

    schedule() {
        clearTimeout(this.timer);
        this.timer = setTimeout(this.callback, 400);
    }

    stop() {
        this.observer?.disconnect();
        clearTimeout(this.timer);
        this.observer = null;
    }
}class MathDetector {
    static scan() {
        const selectors = [
            '[data-testid*="question"]',
            '[data-testid*="problem"]'
        ];

        return [...document.querySelectorAll(selectors.join(","))]
            .filter(el => el.innerText?.trim())
            .map(el => ({
                element: el,
                text: el.innerText.trim()
            }));
    }
}class MathEngine {
    static evaluate(source) {
        const input = source.replace(/\s/g, "");

        if (!/^[\d+\-*/().%]+$/.test(input)) {
            return { success: false, error: "Unsupported expression" };
        }

        const tokens = input.match(/\d+(?:\.\d+)?|[()+\-*/%]/g);

        if (!tokens || tokens.join("") !== input) {
            return { success: false, error: "Invalid syntax" };
        }

        let i = 0;

        function primary() {
            const token = tokens[i++];

            if (token === "(") {
                const value = expression();
                if (tokens[i++] !== ")") throw Error("Missing )");
                return value;
            }

            if (token === "-") return -primary();
            if (token === "+") return primary();

            return Number(token);
        }

        function term() {
            let value = primary();

            while (["*", "/", "%"].includes(tokens[i])) {
                const op = tokens[i++];
                const right = primary();

                if ((op === "/" || op === "%") && right === 0) {
                    throw Error("Division by zero");
                }

                if (op === "*") value *= right;
                if (op === "/") value /= right;
                if (op === "%") value %= right;
            }

            return value;
        }

        function expression() {
            let value = term();

            while (["+", "-"].includes(tokens[i])) {
                const op = tokens[i++];
                const right = term();
                value = op === "+" ? value + right : value - right;
            }

            return value;
        }

        try {
            const result = expression();

            if (i !== tokens.length || !Number.isFinite(result)) {
                throw Error("Invalid expression");
            }

            return { success: true, result };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}class MathPanel {
    static create() {
        if (document.getElementById("khanvision-panel")) return;

        const panel = document.createElement("div");
        panel.id = "khanvision-panel";

        Object.assign(panel.style, {
            position: "fixed",
            right: "16px",
            bottom: "20px",
            width: "280px",
            zIndex: "2147483647",
            background: "#151923",
            color: "white",
            padding: "16px",
            borderRadius: "14px",
            fontFamily: "system-ui",
            boxShadow: "0 8px 35px #0008"
        });

        const heading = document.createElement("strong");
        heading.textContent = "KhanVision";

        const close = document.createElement("button");
        close.textContent = "×";
        close.style.cssFloat = "right";
        close.onclick = () => panel.remove();

        const content = document.createElement("div");
        content.id = "kv-content";
        content.textContent = "Đang chờ nội dung toán học...";

        panel.append(heading, close, document.createElement("hr"), content);
        document.body.appendChild(panel);
    }

    static update(text) {
        const content = document.getElementById("kv-content");
        if (content) content.textContent = text;
    }
}(() => {
    if (!location.hostname.endsWith("khanacademy.org")) {
        alert("KhanVision chỉ chạy trên Khan Academy.");
        return;
    }

    if (window.__KHANVISION_ACTIVE__) return;
    window.__KHANVISION_ACTIVE__ = true;

    MathPanel.create();

    const observer = new PageObserver(() => {
        const questions = MathDetector.scan();

        if (!questions.length) {
            MathPanel.update("Chưa phát hiện vùng câu hỏi.");
            return;
        }

        const results = questions.map((question, index) => {
            const result = MathEngine.evaluate(question.text);

            if (result.success) {
                return `${index + 1}. Kết quả: ${result.result}`;
            }

            return `${index + 1}. Chưa hỗ trợ dạng toán này.`;
        });

        MathPanel.update(results.join("\n"));
    });

    observer.start();

    console.log("KhanVision initialized.");
})();})();