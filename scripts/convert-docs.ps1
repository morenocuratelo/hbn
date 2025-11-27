param(
    [string]$Source = "docs",
    [string]$Destination = "docs_md",
    [string]$Media = "docs_md/media",
    [string]$PythonPath = $null
)

if (-not $PythonPath) {
    $venvPython = Join-Path $PSScriptRoot "..\.venv\Scripts\python.exe"
    if (Test-Path $venvPython) {
        $PythonPath = $venvPython
    } else {
        $PythonPath = "python"
    }
}

$scriptPath = Join-Path $PSScriptRoot "convert_docs.py"

if (-not (Test-Path $scriptPath)) {
    Write-Error "convert_docs.py non trovato in $PSScriptRoot"
    exit 1
}

$arguments = @(
    "`"$scriptPath`"",
    "--src", "`"$Source`"",
    "--dest", "`"$Destination`"",
    "--media", "`"$Media`""
)

$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = $PythonPath
$psi.ArgumentList.AddRange($arguments)
$psi.RedirectStandardOutput = $true
$psi.RedirectStandardError = $true
$psi.UseShellExecute = $false

$proc = [System.Diagnostics.Process]::Start($psi)
$proc.WaitForExit()

Write-Output $proc.StandardOutput.ReadToEnd()
if ($proc.ExitCode -ne 0) {
    Write-Error $proc.StandardError.ReadToEnd()
}
exit $proc.ExitCode
