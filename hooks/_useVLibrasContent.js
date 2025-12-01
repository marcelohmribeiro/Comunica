import { useEffect } from "react";
import { useVLibras } from "@/contexts/_vlibras-context";

/**
 * @param {string|function} content
 * @param {Array} deps
 */
export const useVLibrasContent = (content, deps = []) => {
  const { updateContent } = useVLibras();

  useEffect(() => {
    const htmlContent = typeof content === "function" ? content() : content;

    if (htmlContent) {
      updateContent(htmlContent);
    }
  }, deps);
};

export const generateHtmlFromScreen = (title, sections = []) => {
  return `
    <div>
      ${title ? `<h1>${title}</h1>` : ""}
      ${sections
        .map((section) => {
          if (typeof section === "string") {
            return `<p>${section}</p>`;
          }
          if (section.title && section.content) {
            if (Array.isArray(section.content)) {
              return `
              <div>
                <h2>${section.title}</h2>
                <ul>
                  ${section.content.map((item) => `<li>${item}</li>`).join("")}
                </ul>
              </div>
            `;
            }
            return `
            <div>
              <h2>${section.title}</h2>
              <p>${section.content}</p>
            </div>
          `;
          }
          return "";
        })
        .join("")}
      <div class="info-box">
        <strong>💡 Como usar o VLibras:</strong>
        <p style="margin-top: 8px;">Clique no botão azul do VLibras abaixo e depois selecione qualquer texto desta tela para traduzir em Libras.</p>
      </div>
    </div>
  `;
};
