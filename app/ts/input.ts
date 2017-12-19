import * as Collections from 'typescript-collections';

export enum Key {
    BACKSPACE = 8,
    TAB = 9,
    ENTER = 13,
    SHIFT = 16,
    CTRL = 17,
    ALT = 18,
    PAUSE_BREAK = 19,
    CAPS_LOCK = 20,
    ESCAPE = 27,
    SPACE = 32,
    PAGE_UP = 33,
    PAGE_DOWN = 34,
    END = 35,
    HOME = 36,
    LEFT_ARROW = 37,
    UP_ARROW = 38,
    RIGHT_ARROW = 39,
    DOWN_ARROW = 40,
    INSERT = 45,
    DELETE = 46,
    ZERO = 48,
    ONE = 49,
    TWO = 50,
    THREE = 51,
    FOUR = 52,
    FIVE = 53,
    SIX = 54,
    SEVEN = 55,
    EIGHT = 56,
    NINE = 57,
    A = 65,
    B = 66,
    C = 67,
    D = 68,
    E = 69,
    F = 70,
    G = 71,
    H = 72,
    I = 73,
    J = 74,
    K = 75,
    L = 76,
    M = 77,
    N = 78,
    O = 79,
    P = 80,
    Q = 81,
    R = 81,
    S = 83,
    T = 84,
    U = 85,
    V = 86,
    W = 87,
    X = 88,
    Y = 89,
    Z = 90,
    WIN_LEFT = 91,
    WIN_RIGHT = 92,
    SELECT = 93,
    NUM_ZERO = 96,
    NUM_ONE = 97,
    NUM_TWO = 98,
    NUM_THREE = 99,
    NUM_FOUR = 100,
    NUM_FIVE = 101,
    NUM_SIX = 102,
    NUM_SEVEN = 103,
    NUM_EIGHT = 104,
    NUM_NINE = 105,
    MULTIPLY = 106,
    ADD = 107,
    SUBTRACT = 109,
    DECIMAL = 110,
    DIVIDE = 111,
    F1 = 112,
    F2 = 113,
    F3 = 114,
    F4 = 115,
    F5 = 116,
    F6 = 117,
    F7 = 118,
    F8 = 119,
    F9 = 120,
    F10 = 121,
    F11 = 122,
    F12 = 123,
    NUM_LOCK = 144,
    SCROLL_LOCK = 145,
    SEMICOLON = 186,
    EQUALS = 187,
    COMMA = 188,
    DASH = 189,
    PERIOD = 190,
    FORWARD_SLASH = 191,
    GRAVE_ACCENT = 192,
    OPEN_BRACKET = 219,
    BACK_SLASH = 220,
    CLOSE_BRACKET = 221,
    SINGLE_QUOTE = 222
}

export class InputManager {
    private constructor() {}

    private static mInstance = new InputManager();

    private mPressed = new Collections.Set<Key>();
    private mLastPressed = new Collections.Set<Key>();

    static GetInstance() {
        return InputManager.mInstance;
    }

    isDown(keyCode: Key) {
        return this.mPressed.contains(keyCode);
    }

    pressed(keyCode: Key) {
        return this.mPressed.contains(keyCode) && !this.mLastPressed.contains(keyCode);
    }

    isUp(keyCode: Key) {
        return !this.mPressed.contains(keyCode);
    }

    released(keyCode: Key) {
        return !this.mPressed.contains(keyCode) && this.mLastPressed.contains(keyCode);
    }

    onKeydown(event: KeyboardEvent) {
        this.mPressed.add(event.keyCode);
        event.preventDefault();
    }

    onKeyup(event: KeyboardEvent) {
        this.mPressed.remove(event.keyCode);
        event.preventDefault();
    }

    flush() {
        this.mLastPressed.clear();
        this.mLastPressed.union(this.mPressed);
    }
}