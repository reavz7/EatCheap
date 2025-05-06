"use client"

import { useRef } from "react"

const RecipePDFGenerator = ({ recipe, ingredients }) => {
  const printRef = useRef(null)

  // Funkcja do generowania i pobierania PDF
  const handlePrintPDF = () => {
    const printWindow = window.open("", "_blank")

    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${recipe.recipeName} - Przepis</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              h1 {
                font-size: 24px;
                margin-bottom: 16px;
              }
              h2 {
                font-size: 18px;
                margin-top: 24px;
                margin-bottom: 12px;
              }
              ul {
                padding-left: 20px;
              }
              li {
                margin-bottom: 8px;
              }
              .instruction {
                margin-bottom: 12px;
              }
              .meta {
                color: #666;
                font-size: 14px;
                margin-bottom: 20px;
              }
              .tags {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
              }
              .tag {
                background: #f0f0f0;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <h1>${recipe.recipeName}</h1>
            <div class="meta">Czas przygotowania: ${recipe.averagePreparationTime} min</div>
            <p>${recipe.description}</p>
            
            <div class="tags">
              ${recipe.isVegan ? '<span class="tag">Wegańskie</span>' : ""}
              ${recipe.isVegetarian ? '<span class="tag">Wegetariańskie</span>' : ""}
              ${recipe.isGlutenFree ? '<span class="tag">Bez glutenu</span>' : ""}
            </div>
            
            <h2>Składniki</h2>
            <ul>
              ${ingredients
                .map(
                  (item) => `
                <li>${item.quantity} ${item.unit} ${item.ingredient.name}</li>
              `,
                )
                .join("")}
            </ul>
            
            <h2>Instrukcje</h2>
            <div>
              ${recipe.instructions
                .split("\n")
                .map(
                  (instruction) => `
                <div class="instruction">${instruction}</div>
              `,
                )
                .join("")}
            </div>
          </body>
        </html>
      `)

      printWindow.document.close()
      printWindow.focus() 

      // Opóźnienie, aby dać przeglądarce czas na załadowanie zawartości
      setTimeout(() => {
        printWindow.print()
        // Niektóre przeglądarki mogą zamknąć okno po wydruku, inne nie
        // printWindow.close()
      }, 500)
    }
  }

  return (
    <button
      onClick={handlePrintPDF}
      className="h-8 px-3 bg-blue-600 w-29 hover:bg-blue-700 text-white rounded-md flex items-center justify-center shadow-sm text-s cursor-pointer"
    >
      Pobierz PDF
    </button>
  )
}

export default RecipePDFGenerator