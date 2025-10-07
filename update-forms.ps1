# Script para atualizar todos os formulários com campo nome somente leitura

$forms = @(
    "CollectionForm",
    "TranspixForm", 
    "TranscomprasForm",
    "TranspixCadastralForm",
    "TranscomprasCadastralForm",
    "TrackingForm",
    "CorrectionLetterForm",
    "FilialContatoForm",
    "TermoIsencaoAvariaForm",
    "AutorizacaoEmbarqueForm"
)

foreach ($form in $forms) {
    $filePath = ".\src\components\$form.tsx"
    
    if (Test-Path $filePath) {
        Write-Host "Atualizando $form..." -ForegroundColor Green
        
        # Lê o conteúdo do arquivo
        $content = Get-Content $filePath -Raw
        
        # Atualiza o tipo FormProps
        $content = $content -replace "type FormProps = \{[^}]+\}", @"
type FormProps = {
  loggedUser?: {
    login: string;
    nome_completo: string;
    role: string;
  } | null;
  readOnlyName?: boolean;
}
"@
        
        # Atualiza a declaração do componente
        $content = $content -replace "const $form.*?= \{ loggedUser \}", "const $form: React.FC<FormProps> = { loggedUser, readOnlyName = false }"
        
        # Atualiza os campos de input de nome
        $content = $content -replace "(<input[^>]*value=\{name\}[^>]*onChange=\{[^}]*\}[^>]*placeholder=""[^""]*""[^>]*)(/?>)", '$1 readOnly={readOnlyName} style={readOnlyName ? { backgroundColor: "#f8f9fa", cursor: "not-allowed" } : {}}$2'
        
        # Salva o arquivo atualizado
        Set-Content $filePath $content -Encoding UTF8
        
        Write-Host "✓ $form atualizado com sucesso!" -ForegroundColor Green
    } else {
        Write-Host "✗ Arquivo $filePath não encontrado" -ForegroundColor Red
    }
}

Write-Host "`nTodos os formulários foram processados!" -ForegroundColor Cyan
