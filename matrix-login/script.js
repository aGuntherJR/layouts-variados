const terminal = document.querySelector('.terminalContainer');
const loginOculto = document.getElementById('loginOculto');

// Variáveis de estado
let username = '';
let password = '';
let isTypingPassword = false;

// Elementos da linha de digitação
let currentLine;
let cursor;

// Função para criar uma nova linha com cursor
function createLine(promptText) {
    // Encontre e remova todos os cursores existentes
    const existingCursors = document.querySelectorAll('.cursor');
    existingCursors.forEach(c => c.remove());

    const lineWrapper = document.createElement('div');
    currentLine = document.createElement('span');
    cursor = document.createElement('span');

    currentLine.className = 'line';
    cursor.className = 'cursor';
    cursor.textContent = '|';

    currentLine.textContent = promptText;

    lineWrapper.appendChild(currentLine);
    lineWrapper.appendChild(cursor);
    terminal.appendChild(lineWrapper);

    // limpa input oculto
    loginOculto.value = '';
    loginOculto.focus();
}

// Função para resetar o terminal (após animação)
function resetTerminal() {
    username = '';
    password = '';
    isTypingPassword = false;
    terminal.innerHTML = '';
    createLine('Login: ');
    // Adiciona o listener novamente para que o usuário possa interagir
    loginOculto.addEventListener('keydown', handleKeyDown);
}

// Função que faz a animação de "apagar" a tela
function clearAnimation() {
    const lines = Array.from(terminal.children);
    let i = lines.length - 1;

    function deleteLine() {
        if (i >= 0) {
            lines[i].remove();
            i--;
            setTimeout(deleteLine, 40);
        } else {
            resetTerminal();
        }
    }

    deleteLine();
}

// Função de efeito typing
function typeLine(text, callback, speed = 20) {
    const line = document.createElement('div');
    terminal.appendChild(line);

    let i = 0;
    function typing() {
        if (i < text.length) {
            line.textContent += text.charAt(i);
            i++;
            setTimeout(typing, speed);
        } else if (callback) {
            setTimeout(callback, 500);
        }
    }
    typing();
}

// Função para contagem regressiva
function selfDestructSequence() {
    let count = 3;

    function step() {
        if (count > 0) {
            typeLine(`Self-Destruct in ${count}...`, () => {
                count--;
                step();
            });
        } else {
            typeLine('clear', () => {
                setTimeout(clearAnimation, 250);
            });
        }
    }

    step();
}

// ---
// Lógica para travar o teclado
// ---

// 1. Defina a função do evento de teclado
function handleKeyDown(event) {
    const key = event.key;

    if (key === 'Enter') {
        event.preventDefault();
        cursor.remove();

        if (!isTypingPassword) {
            // Guarda login
            isTypingPassword = true;
            username = username.trim();
            // Cria nova linha pedindo senha
            createLine('Password: ');
        } else {
            // Guarda senha
            password = password.trim();
            // Mostra mensagem final
            createLine('Access Granted!');

            // Travando o teclado removendo o listener
            loginOculto.removeEventListener('keydown', handleKeyDown);

            // Inicia a sequência de mensagens encadeadas
            setTimeout(() => {
                createLine('Welcome, ' + username + '.');
                setTimeout(() => {
                    selfDestructSequence();
                }, 1000);
            }, 1000);
        }
    } else if (key === 'Backspace') {
        // Apaga caracteres
        if (!isTypingPassword) {
            username = username.slice(0, -1);
            currentLine.textContent = 'Login: ' + username;
        } else {
            password = password.slice(0, -1);
            currentLine.textContent = 'Password: ' + '*'.repeat(password.length);
        }
    } else if (key.length === 1 && key !== ' ') {
        // Digitação normal
        if (!isTypingPassword) {
            username += key;
            currentLine.textContent = 'Login: ' + username;
        } else {
            password += key;
            currentLine.textContent = 'Password: ' + '*'.repeat(password.length);
        }
    }

    // Recoloca o cursor no final da linha
    if (cursor.parentNode) {
        cursor.remove();
        currentLine.parentNode.appendChild(cursor);
    }
}

// Inicia pedindo o Login e adiciona o listener nomeado
createLine('Login: ');
loginOculto.addEventListener('keydown', handleKeyDown);