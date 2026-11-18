export class MathDetector {
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
}
