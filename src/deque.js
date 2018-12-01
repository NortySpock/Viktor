class Deque
{
    constructor()
    {
        this._front = null;
        this._back = null;
    }

    isEmpty()
    {
        return this._front === null;
    }

    length()
    {
        if(this._front === null)
        {
            return 0;
        }
        else
        {
            let counter = 1;
            let current = this._front;
            while(current.back !== null)
            {
                current = current.back;
                counter++;
            }
            return counter;
        }
    }

    peekFront()
    {
        if(this._front !== null)
        {
            return this._front.value;
        }
        return null;
    }

    pushFront(valueIn)
    {
        let node = {value:valueIn};
        if(this._front == null)
        {
            this._front = node;
            this._back = node;
            node.front = null;
            node.back = null;
        }
        else
        {
            let previous_front = this._front;
            node.front = null;
            node.back = previous_front;
            this._front = node;
        }
    }

    peekBack()
    {
        if(this._back !== null)
        {
            return this._back.value;
        }
        return null;
    }
}
