describe("Empty test", function(){
   let d = new Deque();
   it("initial length is 0",function(){
      expect(d.length()).toEqual(0);
   });

  it("initial length run backwards is 0",function(){
      expect(d._lengthBackwards()).toEqual(0);
   });


   it("initially isEmpty is true",function()
   {
       expect(d.isEmpty()).toBe(true);
   });


   it("initial front is null",function()
   {
       expect(d.peekFront()).toBe(null);
   });

});


describe("PushFront 1 element test", function(){
   let d = new Deque();
   d.pushFront(5);

   it("length check",function(){
      expect(d.length()).toEqual(1);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(1);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 5",function()
   {
       expect(d.peekFront()).toBe(5);
   });

   it("peekBack is known value 5",function()
   {
       expect(d.peekBack()).toBe(5);
   });

   it("double peeking front has same value",function()
   {
       expect(d.peekFront()).toBe(5);
       expect(d.peekFront()).toBe(5);
   });

   it("double peeking back has same value",function()
   {
       expect(d.peekBack()).toBe(5);
       expect(d.peekBack()).toBe(5);
   });


   it("peekFront and peekBack are same value",function()
   {
       expect(d.peekFront()===d.peekBack()).toBe(true);
   });

});


describe("PushFront 2 element test", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushFront(4);

   it("length check",function(){
      expect(d.length()).toEqual(2);
   });

  it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(2);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 4",function()
   {
       expect(d.peekFront()).toBe(4);
   });

   it("peekBack is known value 5",function()
   {
       expect(d.peekBack()).toBe(5);
   });

});


describe("PushFront 3 element test", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushFront(4);
   d.pushFront(3);

   it("length check",function(){
      expect(d.length()).toEqual(3);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(3);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 3",function()
   {
       expect(d.peekFront()).toBe(3);
   });

   it("peekBack is known value 5",function()
   {
       expect(d.peekBack()).toBe(5);
   });

});


describe("popFront 1 of 3 element test", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushFront(4);
   d.pushFront(3);
   let result = d.popFront();

   it("length check",function(){
      expect(d.length()).toEqual(2);
   });


   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(2);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("result is known value 3",function()
   {
       expect(result).toBe(3);
   });

  it("peekFront is known value 4",function()
   {
       expect(d.peekFront()).toBe(4);
   });

   it("peekBack is known value 5",function()
   {
       expect(d.peekBack()).toBe(5);
   });

});

describe("popFront 2 of 3 element test", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushFront(4);
   d.pushFront(3);
   let discard = d.popFront();
   let result = d.popFront();

   it("length check",function(){
      expect(d.length()).toEqual(1);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(1);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("result is known value 4",function()
   {
       expect(result).toBe(4);
   });

  it("peekFront is known value 5",function()
   {
       expect(d.peekFront()).toBe(5);
   });

   it("peekBack is known value 5",function()
   {
       expect(d.peekBack()).toBe(5);
   });

});

describe("popFront 3 of 3 element test", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushFront(4);
   d.pushFront(3);
   let discard = d.popFront();
   let discard2 = d.popFront();
   let result = d.popFront();

   it("length check",function(){
      expect(d.length()).toEqual(0);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(0);
   });

   it("isEmpty check",function()
   {
       expect(d.isEmpty()).toBe(true);
   });

   it("result is known value 5",function()
   {
       expect(result).toBe(5);
   });

  it("peekFront is null",function()
   {
       expect(d.peekFront()).toBe(null);
   });

   it("peekBack is null",function()
   {
       expect(d.peekBack()).toBe(null);
   });

});

describe("PushBack 1 element test", function(){
   let d = new Deque();
   d.pushBack(15);


     it("length check",function(){
      expect(d.length()).toEqual(1);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(1);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 15",function()
   {
       expect(d.peekFront()).toBe(15);
   });

   it("peekBack is known value 15",function()
   {
       expect(d.peekBack()).toBe(15);
   });

   it("double peeking front has same value",function()
   {
       expect(d.peekFront()).toBe(15);
       expect(d.peekFront()).toBe(15);
   });

   it("double peeking back has same value",function()
   {
       expect(d.peekBack()).toBe(15);
       expect(d.peekBack()).toBe(15);
   });


   it("peekFront and peekBack are same value",function()
   {
       expect(d.peekFront()===d.peekBack()).toBe(true);
   });
});


describe("PushBack 2 element test", function(){
   let d = new Deque();
   d.pushBack(15);
   d.pushBack(14);


   it("length check",function(){
      expect(d.length()).toEqual(2);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(2);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 15",function()
   {
       expect(d.peekFront()).toBe(15);
   });

   it("peekBack is known value 14",function()
   {
       expect(d.peekBack()).toBe(14);
   });

   it("double peeking front has same value",function()
   {
       expect(d.peekFront()).toBe(15);
       expect(d.peekFront()).toBe(15);
   });

   it("double peeking back has same value",function()
   {
       expect(d.peekBack()).toBe(14);
       expect(d.peekBack()).toBe(14);
   });


   it("peekFront and peekBack are diferent value",function()
   {
       expect(d.peekFront()!==d.peekBack()).toBe(true);
   });
});


describe("PushBack 3 element test", function(){
   let d = new Deque();
   d.pushBack(15);
   d.pushBack(14);
   d.pushBack(13);


   it("length check",function(){
      expect(d.length()).toEqual(3);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(3);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 15",function()
   {
       expect(d.peekFront()).toBe(15);
   });

   it("peekBack is known value 13",function()
   {
       expect(d.peekBack()).toBe(13);
   });

   it("double peeking front has same value",function()
   {
       expect(d.peekFront()).toBe(15);
       expect(d.peekFront()).toBe(15);
   });

   it("double peeking back has same value",function()
   {
       expect(d.peekBack()).toBe(13);
       expect(d.peekBack()).toBe(13);
   });


   it("peekFront and peekBack are diferent value",function()
   {
       expect(d.peekFront()!==d.peekBack()).toBe(true);
   });
});


describe("popBack 1 of 3 element test", function(){
   let d = new Deque();
   d.pushBack(5);
   d.pushBack(4);
   d.pushBack(3);
   let result = d.popBack();

   it("length check",function(){
      expect(d.length()).toEqual(2);
   });


   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(2);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("result is known value 3",function()
   {
       expect(result).toBe(3);
   });

  it("peekFront is known value 5",function()
   {
       expect(d.peekFront()).toBe(5);
   });

   it("peekBack is known value 4",function()
   {
       expect(d.peekBack()).toBe(4);
   });

});

describe("popBack 2 of 3 element test", function(){
   let d = new Deque();
   d.pushBack(5);
   d.pushBack(4);
   d.pushBack(3);
   let discard = d.popBack();
   let result = d.popBack();

   it("length check",function(){
      expect(d.length()).toEqual(1);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(1);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("result is known value 4",function()
   {
       expect(result).toBe(4);
   });

  it("peekFront is known value 5",function()
   {
       expect(d.peekFront()).toBe(5);
   });

   it("peekBack is known value 5",function()
   {
       expect(d.peekBack()).toBe(5);
   });

});

describe("popBack 3 of 3 element test", function(){
   let d = new Deque();
   d.pushBack(5);
   d.pushBack(4);
   d.pushBack(3);
   let discard = d.popBack();
   let discard2 = d.popBack();
   let result = d.popBack();

   it("length check",function(){
      expect(d.length()).toEqual(0);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(0);
   });

   it("isEmpty check",function()
   {
       expect(d.isEmpty()).toBe(true);
   });

   it("result is known value 5",function()
   {
       expect(result).toBe(5);
   });

  it("peekFront is null",function()
   {
       expect(d.peekFront()).toBe(null);
   });

   it("peekBack is null",function()
   {
       expect(d.peekBack()).toBe(null);
   });

});


describe("pushFront and pushBack one each", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushBack(4);

   it("length check",function(){
      expect(d.length()).toEqual(2);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(2);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


  it("peekFront is known value 5",function()
   {
       expect(d.peekFront()).toBe(5);
   });

   it("peekBack is known value 4",function()
   {
       expect(d.peekBack()).toBe(4);
   });

});


describe("Push Pop Push Front ", function(){
   let d = new Deque();
   d.pushFront(5);
   d.popFront();
   d.pushFront(4);

   it("length check",function(){
      expect(d.length()).toEqual(1);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(1);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


  it("peekFront is known value 4",function()
   {
       expect(d.peekFront()).toBe(4);
   });

   it("peekBack is known value 4",function()
   {
       expect(d.peekBack()).toBe(4);
   });

});

describe("Push Pop Push Back ", function(){
   let d = new Deque();
   d.pushBack(5);
   d.popBack();
   d.pushBack(4);

   it("length check",function(){
      expect(d.length()).toEqual(1);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(1);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


  it("peekFront is known value 4",function()
   {
       expect(d.peekFront()).toBe(4);
   });

   it("peekBack is known value 4",function()
   {
       expect(d.peekBack()).toBe(4);
   });

});


describe("Push from Back, Pop From Front 1 ", function(){
   let d = new Deque();
   d.pushBack(5);
   d.pushBack(4);
   d.pushBack(3);
   let result = d.popFront();

   it("result check",function()
   {
       expect(result).toBe(5);
   });

});

describe("Push from Back, Pop From Front 2 ", function(){
   let d = new Deque();
   d.pushBack(5);
   d.pushBack(4);
   d.pushBack(3);
   let discard = d.popFront();
   let result = d.popFront();

   it("result check",function()
   {
       expect(result).toBe(4);
   });

});

describe("Push from Back, Pop From Front 3 ", function(){
   let d = new Deque();
   d.pushBack(5);
   d.pushBack(4);
   d.pushBack(3);
   let discard = d.popFront();
   discard = d.popFront();
   let result = d.popFront();

   it("result check",function()
   {
       expect(result).toBe(3);
   });

});


describe("can push and pop a waypoint", function(){
   let d = new Deque();
   let waypoint = {x:1,y:2}
   d.pushBack(waypoint);
   let result = d.popFront();

   it("result check",function()
   {
       expect(result.x).toBe(1);
       expect(result.y).toBe(2);
   });

});


describe("can push and pop waypoint 2", function(){
   let d = new Deque();
   let waypoint = {x:1,y:2}
   let waypoint2 = {x:3,y:4}
   d.pushBack(waypoint);
   d.pushBack(waypoint2);
   let discard = d.popFront();
   let result = d.popFront();

   it("result check",function()
   {
       expect(result.x).toBe(3);
       expect(result.y).toBe(4);
   });

});



describe("PushFront 100 element test", function(){
   let d = new Deque();

   for(let i = 1; i<=100; i++)
   {
       d.pushFront(i)
   }

   it("length check",function(){
      expect(d.length()).toEqual(100);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(100);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 100",function()
   {
       expect(d.peekFront()).toBe(100);
   });

   it("peekBack is known value 1",function()
   {
       expect(d.peekBack()).toBe(1);
   });

});

describe("PushFront PopBack can get 100 items out FIFO", function(){
   let d = new Deque();

   for(let i = 1; i<=100; i++)
   {
       d.pushFront(i)
   }


   it("can get all 100 items out FIFO",function()
   {
       for(let i = 1; i<=100; i++)
       {
           let result = d.popBack()
           if(result)
           {
            expect(result).toEqual(i);
            if(d.peekBack())
            {
                expect(d.peekBack()).toEqual(i+1);
            }
           }
           else
           {
               expect(result).toBe(null);
           }
       }
   });



});

describe("PushBack PopFront can get 100 items out FIFO", function(){
   let d = new Deque();

   for(let i = 1; i<=100; i++)
   {
       d.pushBack(i)
   }


   it("can get all 100 items out FIFO",function()
   {
       for(let i = 1; i<=100; i++)
       {
           let result = d.popFront()
           if(result)
           {
            expect(result).toEqual(i);
            if(d.peekFront())
            {
                expect(d.peekFront()).toEqual(i+1);
            }
           }
           else
           {
               expect(result).toBe(null);
           }
       }
   });



});

describe("PushBack 100 element test", function(){
   let d = new Deque();

   for(let i = 1; i<=100; i++)
   {
       d.pushBack(i)
   }

   it("length check",function(){
      expect(d.length()).toEqual(100);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(100);
   });

   it("isEmpty is false",function()
   {
       expect(d.isEmpty()).toBe(false);
   });


   it("front is known value 1",function()
   {
       expect(d.peekFront()).toBe(1);
   });

   it("peekBack is known value 100",function()
   {
       expect(d.peekBack()).toBe(100);
   });

});





describe("clear test", function(){
   let d = new Deque();
   d.pushFront(5);
   d.pushFront(4);
   d.pushFront(3);
   d.clear();

   it("length check",function(){
      expect(d.length()).toEqual(0);
   });

   it("length check backwards",function(){
      expect(d._lengthBackwards()).toEqual(0);
   });

   it("isEmpty is true",function()
   {
       expect(d.isEmpty()).toBe(true);
   });

   it("peekFront is null",function()
   {
       expect(d.peekFront()).toBe(null);
   });

   it("peekBack is null",function()
   {
       expect(d.peekBack()).toBe(null);
   });

});


