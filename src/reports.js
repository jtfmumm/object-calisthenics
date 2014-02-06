var reports = (function() {
//Reports
	//FILTERS
	//A list of filters.  Use .append to add a filter. 
	function FilterList() {
		ObjectList.call(this);
		for (var i = 0; i < arguments.length; i++) 
			this.list.push(arguments[i]);		
	}
	FilterList.prototype = Object.create(ObjectList.prototype);
	FilterList.prototype.constructor = FilterList;
	FilterList.prototype.filter = function(obj) {
		return this.list.every(obj.passesFilter.bind(obj));
	};


	//TABLES
	function FieldName(valueObject) {
		valueObject.call(this, null);
		this.constructor = valueObject;
		this.displayFieldName = this.constructor.prototype.displayFieldName;
	}

	function FieldNames() {
		ObjectList.call(this);
		for (var i = 0; i < arguments.length; i++) 
			this.list.push(new FieldName(arguments[i]));	
	}
	FieldNames.prototype = Object.create(ObjectList.prototype);
	FieldNames.prototype.constructor = FieldNames;
	FieldNames.prototype.addField = function(field) {
		var field = new FieldName(field);
		this.append(field);
	};
	FieldNames.prototype.addFieldNamesToReport = function(thisReport) {
		this.list.forEach(function(item) {
			item.displayFieldName(thisReport);
		});
		thisReport.nextLine();	
	};


	function Report(fieldNames) {
		this.fieldNames = fieldNames;
		this.fields = [];
	}
	Report.prototype.addField = function(field) {
		this.fields.push(field);
	};
	Report.prototype.display = function(format) {
		var thisReport = new format();
		this.fieldNames.addFieldNamesToReport(thisReport);
		this.fields.forEach(function(obj) {
			obj.display(thisReport);
			thisReport.nextLine();
		});
		return thisReport.display();		
	}


	function TextReport() {
		this.text = "";
	}
	TextReport.prototype.nextLine = function() {
		this.text = this.text.substring(0, this.text.length - 2);
		this.text += "\n";
	};
	TextReport.prototype.addEntry = function(entry) {
		this.text += (entry + ', ');
	};
	TextReport.prototype.display = function() {
		this.text = this.text.substring(0, this.text.length - 1);
		return this.text;
	};

	function CsvReport() {}

	function HtmlReport() {}


	var reports = {
		FilterList: FilterList,
		FieldName: FieldName,
		FieldNames: FieldNames,
		Report: Report,
		TextReport: TextReport,
		CsvReport: CsvReport,
		HtmlReport: HtmlReport
	}

	return reports;

})();