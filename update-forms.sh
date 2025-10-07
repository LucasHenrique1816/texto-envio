#!/bin/bash

# Lista de formulários para atualizar
FORMS=(
    "TranscomprasForm"
    "TranspixCadastralForm" 
    "TranscomprasCadastralForm"
    "TrackingForm"
    "CorrectionLetterForm"
    "FilialContatoForm"
    "TermoIsencaoAvariaForm"
    "AutorizacaoEmbarqueForm"
)

for form in "${FORMS[@]}"; do
    file="./src/components/${form}.tsx"
    
    if [ -f "$file" ]; then
        echo "Atualizando $form..."
        
        # Backup do arquivo original
        cp "$file" "${file}.backup"
        
        # Atualiza o tipo FormProps (se não tiver readOnlyName)
        if ! grep -q "readOnlyName" "$file"; then
            sed -i 's/} | null;/} | null;\n  readOnlyName?: boolean;/' "$file"
        fi
        
        # Atualiza a declaração do componente (se não tiver readOnlyName)
        if ! grep -q "readOnlyName = false" "$file"; then
            sed -i "s/const ${form}: React.FC<FormProps> = { loggedUser }/const ${form}: React.FC<FormProps> = { loggedUser, readOnlyName = false }/" "$file"
        fi
        
        echo "✓ $form atualizado!"
    else
        echo "✗ Arquivo $file não encontrado"
    fi
done

echo "Processamento concluído!"
