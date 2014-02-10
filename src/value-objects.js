var valueObjects = (function() {
//Dependencies: utilities.js

//Value Objects
	function ValueObject(data, fieldNameString) {
		this.data = data;
	}
	ValueObject.prototype.equals = function(otherValueObject) {
		return this.constructor === otherValueObject.constructor 
			&& this.data === otherValueObject.data;
	};
	ValueObject.prototype.display = function(report) {
		report.addEntry(this.data);
	};
	function Name(name) {
		ValueObject.call(this, name);
	}
	Name.prototype = Object.create(ValueObject.prototype);
	Name.prototype.constructor = Name;

	function JobTitle(title) {
		ValueObject.call(this, title);
	}
	JobTitle.prototype = Object.create(ValueObject.prototype);
	JobTitle.prototype.constructor = Name;

	function Uid(uid) {
		ValueObject.call(this, uid);
	}
	Uid.prototype = Object.create(ValueObject.prototype);
	Uid.prototype.constructor = Uid;

	function Count(count) {
		ValueObject.call(this, count);
	}
	Count.prototype = Object.create(ValueObject.prototype);
	Count.prototype.constructor = Count;

	function FullDate(thisDate) {
		var thisDate = thisDate || utilities.generateDate();
		ValueObject.call(this, thisDate);
	}
	FullDate.prototype = Object.create(ValueObject.prototype);
	FullDate.prototype.constructor = FullDate;

	function FullName(firstName, lastName) {
		this.firstName = new Name(firstName);
		this.lastName = new Name(lastName);
		ValueObject.call(this, new Name(firstName + ' ' + lastName));
	}
	FullName.prototype = Object.create(ValueObject.prototype);
	FullName.prototype.constructor = FullName;
	FullName.prototype.display = function(report) {
		this.firstName.display(report);
		this.lastName.display(report);
	};
	FullName.prototype.displayFirstName = function(report) {
		this.firstName.display(report);
	};
	FullName.prototype.displayLastName = function(report) {
		this.lastName.display(report);
	};


	function ObjectList() {
		this.list = [];
	}
	ObjectList.prototype.append = function(item) {
		this.list.push(item);
	};
	ObjectList.prototype.forEach = function(fn) {
		this.list.forEach(fn);
	};
	ObjectList.prototype.tellEach = function(methodName, args) {
		this.list.forEach(function(item) {
			item[methodName].apply(item, args);
		});
	};
	ObjectList.prototype.every = function(predicate) {
		return this.list.every(predicate);
	}; 
	ObjectList.prototype.count = function() {
		return this.list.length;
	};
	ObjectList.prototype.addLines = function(report, filterList) {
		this.list.forEach(function(obj) {
			if (filterList.filter(obj)) 
				report.addLine(obj);
		});
	};


	var vo = {
		ValueObject: ValueObject,
		Name: Name,
		FullName: FullName,
		JobTitle: JobTitle,
		Uid: Uid,
		Count: Count,
		FullDate: FullDate,
		ObjectList: ObjectList
	};

	return vo;

})();