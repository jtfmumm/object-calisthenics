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
	ValueObject.displayFieldName = function(report) {
		//This is a stub.  Subtypes need to overwrite it.
		report.addEntry('');
	};

	function Name(name) {
		ValueObject.call(this, name);
	}
	Name.prototype = Object.create(ValueObject.prototype);
	Name.prototype.constructor = Name;
	Name.prototype.displayFieldName = function(report) {
		report.addEntry('Name');
	};

	function JobTitle(title) {
		ValueObject.call(this, title);
	}
	JobTitle.prototype = Object.create(ValueObject.prototype);
	JobTitle.prototype.constructor = Name;
	JobTitle.prototype.displayFieldName = function(report) {
		report.addEntry('Job Title');
	};

	function Uid(uid) {
		ValueObject.call(this, uid);
	}
	Uid.prototype = Object.create(ValueObject.prototype);
	Uid.prototype.constructor = Uid;
	Uid.prototype.displayFieldName = function(report) {
		report.addEntry('UID');
	};

	function Count(count) {
		ValueObject.call(this, count);
	}
	Count.prototype = Object.create(ValueObject.prototype);
	Count.prototype.constructor = Count;
	Count.prototype.displayFieldName = function(report) {
		report.addEntry('Count');
	};

	function SucceededCount(count) {
		ValueObject.call(this, count);
	}
	SucceededCount.prototype = Object.create(ValueObject.prototype);
	SucceededCount.prototype.constructor = Count;
	SucceededCount.prototype.displayFieldName = function(report) {
		report.addEntry('Succeeded');
	};

	function FailedCount(count) {
		ValueObject.call(this, count);
	}
	FailedCount.prototype = Object.create(ValueObject.prototype);
	FailedCount.prototype.constructor = Count;
	FailedCount.prototype.displayFieldName = function(report) {
		report.addEntry('Failed');
	};

	function FullDate(thisDate) {
		var thisDate = thisDate || utilities.generateDate();
		ValueObject.call(this, thisDate);
	}
	FullDate.prototype = Object.create(ValueObject.prototype);
	FullDate.prototype.constructor = FullDate;
	FullDate.prototype.displayFieldName = function(report) {
		report.addEntry('Date');
	};

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
	FullName.prototype.displayFieldName = function(report) {
		report.addEntry('First Name');
		report.addEntry('Last Name');
	};
	FullName.prototype.displayFirstName = function(report) {
		this.firstName.display(report);
	};
	FullName.prototype.displayLastName = function(report) {
		this.lastName.display(report);
	};
	FullName.prototype.displayFirstNameFieldName = function(report) {
		report.addEntry('First Name');
	};
	FullName.prototype.displayLastNameFieldName = function(report) {
		report.addEntry('Last Name');
	};


	function ObjectList() {
		this.list = [];
	}
	ObjectList.prototype.append = function(item) {
		this.list.push(item);
	}
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
	ObjectList.prototype.addFields = function(report, filterList) {
		this.list.forEach(function(obj) {
			if (filterList.filter(obj)) 
				report.addField(obj);
		});
	};


	var vo = {
		ValueObject: ValueObject,
		Name: Name,
		FullName: FullName,
		JobTitle: JobTitle,
		Uid: Uid,
		Count: Count,
		SucceededCount: SucceededCount,
		FailedCount: FailedCount,
		FullDate: FullDate,
		ObjectList: ObjectList
	};

	return vo;

})();