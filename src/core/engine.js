export class MathEngine {
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
}
