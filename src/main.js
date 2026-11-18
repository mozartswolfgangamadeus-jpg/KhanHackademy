import { PageObserver } from "./core/observer.js";
import { MathDetector } from "./core/detector.js";
import { MathEngine } from "./core/engine.js";
import { MathPanel } from "./ui/panel.js";

(() => {
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
})();
