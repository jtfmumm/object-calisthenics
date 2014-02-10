var reports = (function() {
//Dependencies: utilities.js, value-objects.js

//Reports
	//FILTERS
	//A list of filters.  Use .append to add a filter. 
	function FilterList() {
		valueObjects.ObjectList.call(this);
		for (var i = 0; i < arguments.length; i++) 
			this.list.push(arguments[i]);		
	}
	FilterList.prototype = Object.create(valueObjects.ObjectList.prototype);
	FilterList.prototype.constructor = FilterList;
	FilterList.prototype.filter = function(obj) {
		return this.list.every(obj.passesFilter.bind(obj));
	};

	function Row() {
		this.data = [];
		for (var i = 0; i < arguments.length; i++)
			this.data.push(arguments[i]);
	}
	Row.prototype.append = function(item) {
		this.data.push(item);
	};
	Row.prototype.display = function(report) {
		this.data.forEach(function(obj) {
			obj.display(report);
		});
	};

	function Report() {
		this.rows = [];
		var fieldNamesRow = new Row();
		for (var i = 0; i < arguments.length; i++) 
			fieldNamesRow.append(new valueObjects.Name(arguments[i]));
		this.rows.push(fieldNamesRow);
	}	
	Report.prototype.addLine = function() {
		var row = new Row();
		for (var i = 0; i < arguments.length; i++) 
			row.append(arguments[i]);
		this.rows.push(row);
	};
	Report.prototype.addField = function(field) {
		this.rows.push(field);
	};
	Report.prototype.display = function(format) {
		var thisReport = new format();
		this.rows.forEach(function(row) {			
			thisReport.startRow();
			row.display(thisReport);
			thisReport.endRow();
		});
		return thisReport.display();		
	};

	function CsvReport() {
		this.text = "";
	}
	CsvReport.prototype.startRow = function() {
	};
	CsvReport.prototype.endRow = function() {
		this.text = this.text.substring(0, this.text.length - 2);
		this.text += "\n";
	};
	CsvReport.prototype.addEntry = function(entry) {
		this.text += (entry + ', ');
	};
	CsvReport.prototype.display = function() {
		this.text = this.text.substring(0, this.text.length - 1);
		return this.text;
	};

	function HtmlReport() {
		this.text = '<table>';
	}
	HtmlReport.prototype.startRow = function() {
		this.text += '<tr>';
	};
	HtmlReport.prototype.endRow = function() {
		this.text += '</tr>';
	};
	HtmlReport.prototype.addEntry = function(entry) {
		this.text += ('<td>' + entry + '</td>');
	};
	HtmlReport.prototype.display = function() {
		this.text += '</table>';
		return this.text;
	};


	var reports = {
		FilterList: FilterList,
		Report: Report,
		CsvReport: CsvReport,
		HtmlReport: HtmlReport
	}

	return reports;

})();