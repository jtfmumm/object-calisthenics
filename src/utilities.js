var utilities = (function() {
//MODULE
	var ut = {};

//Utilities
	ut.makeUidGenerator = function(base) {
		var base = base || 1;
		return function() {
			return base++;
		}
	};

	ut.resumeUidGenerator = ut.makeUidGenerator();
	ut.jobSeekerUidGenerator = ut.makeUidGenerator();
	ut.employerUidGenerator = ut.makeUidGenerator();
	ut.jobUidGenerator = ut.makeUidGenerator();


	ut.isTrue = function(x) {
		return x === true;
	};

	ut.argumentsToArray = function(args) {
		return Array.prototype.slice.call(args);
	};

	ut.areSameValueObjectType = function(vo1, vo2) {
		return vo1 && vo2 && vo1.constructor === vo2.constructor;
	};

	ut.areEqualValueObjects = function(vo1, vo2) {
		return ut.areSameValueObjectType(vo1, vo2) && 
			vo1.equals(vo2);
	};

	ut.containsValueObject = function(arr, obj) {
		return arr.some(function(member) { 
			return ut.areEqualValueObjects(member, obj);
		});
	};

	ut.hasValueObject = function(obj, valueObject) {
		var values = [];
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) 
				values.push(obj[property].equals(valueObject));
		}
		return values.some(ut.isTrue);
	};

	ut.listPropertyValues = function(obj) {
		var propertyValues = [];
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) 
				propertyValues.push(obj[property]);
		}
		return propertyValues;
	};

	ut.findValueObject = function(obj, fieldName) {
		return listPropertyValues(obj).filter(function(x) { 
			return areSameValueObjectType(x, fieldName); 
		})[0];
	};

	ut.rand = function(low, high) {
		return Math.floor(Math.random() * (high - low)) + low + 1;
	};

	ut.generateDate = function() {
		var day = ut.rand(1, 30);
		var month = ut.rand(1, 12);
		var year = ut.rand(2012, 2300);
		return "" + month + "/" + day + "/" + year;
	};


	return ut;

})();