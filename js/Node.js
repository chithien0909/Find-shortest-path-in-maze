

class Node {
    state = null; // State
    parent = null; // Parent node
    f = 0;
    action = -1;

    constructor(_state, _parent, _f, _action) {
        this.state = _state;
        this.parent = _parent;
        this.f = _f;
        this.action = _action;
    }

}
