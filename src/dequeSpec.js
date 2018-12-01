describe("Empty test", function(){
   let d = new Deque();
   it("initial length is 0",function(){
      expect(d.length()).toEqual(0);
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