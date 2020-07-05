

class Node {
    state = null; // State
    parent = null; // Parent node
    f = 0;
    g = 0;
    h = 0;
    action = -1;

    constructor(_state, _parent, _f, _g, _h, _action) {
        this.state = _state;
        this.parent = _parent;
        this.f = _f;
        this.g = _g;
        this.h = _h;
        this.action = _action;
    }

}
