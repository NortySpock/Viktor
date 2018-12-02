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

    _lengthBackwards()
    {
        if(this._back === null)
        {
            return 0;
        }
        else
        {
            let counter = 1;
            let current = this._back;
            while(current.front !== null)
            {
                current = current.front;
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
            previous_front.front = node;
            this._front = node;
        }
    }

    popFront()
    {
        if(this._front == null)
        {
            return null;
        }
        else
        {
            let previous_front = this._front.back;
            if(previous_front !== null)
            {
                previous_front.front = null;
            }
            else
            {
                this._back=null;
            }
            let node = this._front;
            this._front = previous_front;
            return node.value;
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

    pushBack(valueIn)
    {
        let node = {value:valueIn};
        if(this._back == null)
        {
            this._front = node;
            this._back = node;
            node.front = null;
            node.back = null;
        }
        else
        {
            let previous_back = this._back;
            node.front = previous_back;
            previous_back.back = node;
            node.back = null;
            this._back = node;
        }
    }

    popBack()
    {
        if(this._back == null)
        {
            return null;
        }
        else
        {
            let previous_back = this._back.front;
            if(previous_back !== null)
            {
                previous_back.back = null;
            }
            else
            {
                this._front=null;
            }
            let node = this._back;
            this._back = previous_back;
            return node.value;
        }
    }

    clear()
    {
        this._front = null;
        this._back = null;
        //and the GC takes care of the rest eventually
    }
}
