/* Object Calisthenics */



//NAMESPACING
var oc = (function() { 

//UID Generators
	function makeUidGenerator(base) {
		var base = base || 1;
		return function() {
			return base++;
		}
	}

	var resumeUidGenerator = makeUidGenerator();
	var jobSeekerUidGenerator = makeUidGenerator();
	var employerUidGenerator = makeUidGenerator();
	var jobUidGenerator = makeUidGenerator();


//ENTITIES

//Jobs
	function Job(name, employer) {
		this.name = name;
		this.employer = employer;
		this.uid = new Uid(jobUidGenerator());
	}
	Job.prototype.passesFilter = function(filter) {
		return hasValueObject(this, filter);
	};
	Job.prototype.display = function(thisReport) {
		this.name.display(thisReport);
		this.employer.display(thisReport);
	};
	Job.prototype.displayFieldName = function(report) {
		report.addEntry('Job');
	};
	Job.prototype.equals = function(otherObject) {
		return (this.constructor === otherObject.constructor) && (this.uid === otherObject.uid);
	};

/*
	Job.prototype.addField = function(report) {
		this.name.display(report);
		this.employer.addField(report);
	};
	Job.prototype.addToReport = function(thisReport, filterList, fieldNames) {
		if (filterList.filter(this)) {
			var theseFields = new FieldsList();
			theseFields.append(this.name);
			this.employer.addField(theseFields);
			thisReport.addEntries(theseFields);
		}
	};	
*/

	function JReq(name, employer) {
		Job.call(this, name, employer);
	}
	JReq.prototype = Object.create(Job.prototype);
	JReq.prototype.isValidApplication = function(application) {
		return application.hasResume();

	} 

	function ATS(name, employer) {
		Job.call(this, name, employer);
	}
	ATS.prototype = Object.create(Job.prototype);
	ATS.prototype.isValidApplication = function(application) {
		return true;
	}

	var jobList = new ObjectList();


//Employers 
	function Employer(name) {
		this.name = new Name(name);
		this.uid = new Uid(employerUidGenerator());
	};
	Employer.prototype.addField = function(report) {
		report.addEntry(this.name);
	};
	Employer.prototype.display = function(thisReport) {
		this.name.display(thisReport);
	};
	Employer.prototype.displayFieldName = function(report) {
		report.addEntry('Employer');
	};
	Employer.prototype.postJob = function(name, type) {
		var name = new Name(name);
		var newJob = new type(name, this);
		jobList.append(newJob);
	};
	Employer.prototype.listJobs = function() {
		var fields = makeFieldNames(Name, Employer);
		var report = new Report(fields);
		var filters = new FilterList(this);
		jobList.addFields(report, filters);
		return report.display(TextReport);
	};
	Employer.prototype.listJobSeekersWhoApplied = function() {
	};
	Employer.prototype.equals = function(otherObject) {
		return (this.constructor === otherObject.constructor) && (this.uid === otherObject.uid);
	};

	var employerList = new ObjectList();


//Jobseekers
	function JobSeeker(fullName) {
		this.fullName = fullName;
		this.uid = new Uid(jobSeekerUidGenerator());
	}
	JobSeeker.prototype.passesFilter = function(filter) {
		return hasValueObject(this, filter);
	};
	JobSeeker.prototype.createResume = function(resume) {
		var thisResume = new Resume(resume, this);
		resumeList.append(thisResume);
	};
	JobSeeker.prototype.ownResumes = function() {
		var theseResumes = new ObjectList();
		var filters = new FilterList();
		filters.append(this);
		resumeList.tellEach('addToList', [filters, theseResumes]);
		return theseResumes;
	};
	JobSeeker.prototype.saveJob = function(job) {
		var thisSavedJob = new SavedJob(job, this);
		savedJobsList.append(thisSavedJob);
	} 
	JobSeeker.prototype.applyToJob = function(job, resume) {
		var thisDate = new FullDate(generateDate());
		var thisResume = resume || null;
		var thisApplication = new JobApplication(job, this, resume, thisDate);
		if (job.isValidApplication(thisApplication)) 
			jobApplicationList.append(thisApplication);
	};
	JobSeeker.prototype.listJobs = function() {
		var fields = makeFieldNames(Name, Employer);
		var report = new Report(fields);
		var filters = new FilterList();
		jobList.addFields(report, filters);
		return report.display(TextReport);
	};
	JobSeeker.prototype.listSavedJobs = function() {
		var fields = makeFieldNames(Name, Employer);
		var report = new Report(fields);
		var filters = new FilterList(this);
		savedJobsList.addFields(report, filters);
		return report.display(TextReport);
	};
	JobSeeker.prototype.listJobsAppliedTo = function() {
		var fields = makeFieldNames(Job, Employer, FullDate);
		var report = new Report(fields);
		var filters = new FilterList(this);
		jobApplicationList.addFields(report, filters);
		return report.display(TextReport);
	};
	JobSeeker.prototype.equals = function(otherObject) {
		return (this.constructor === otherObject.constructor) && (this.uid === otherObject.uid);
	};

	function SavedJob(job, jobSeeker) {
		this.job = job;
		this.jobSeeker = jobSeeker;
	}
	SavedJob.prototype.passesFilter = function(filter) {
		return hasValueObject(this, filter);
	};
	SavedJob.prototype.display = function(thisReport) {
		this.job.display(thisReport);
	};
	SavedJob.prototype.addField = function(fieldName, list) {
		var field = findValueObject(this, fieldName) || fieldName;
		list.append(field);
	};	
	SavedJob.prototype.addToReport = function(thisReport, filterList) {
		if (filterList.filter(this)) {
			var nullFilterList = new FilterList();
			var theseFields = new FieldsList();
			this.job.addToReport(thisReport, nullFilterList);
		}
	};	

	var jobSeekerList = new ObjectList();
	var savedJobsList = new ObjectList();


//Resumes
	function Resume(resume, jobSeeker) {
		this.resume = resume;
		this.jobSeeker = jobSeeker;
	}
	Resume.prototype.addToList = function(filters, list) {
		if (filters.filter(this)) 
			list.append(this);
	};
	Resume.prototype.passesFilter = function(filter) {
		return hasValueObject(this, filter);
	};
	Resume.prototype.addField = function(fieldName, list) {
		var field = findValueObject(this, fieldName) || fieldName;
		list.append(field);
	};
	Resume.prototype.addToReport = function(thisReport, filterList, fieldNames) {
		if (filterList.filter(this)) {
			var self = this;
			var theseFields = new FieldsList();
			fieldNames.addFieldsToFieldsList(self, theseFields);
			thisReport.addEntries(theseFields);
		}
	};	

	var resumeList = new ObjectList();


//JobApplications
	function JobApplication(job, jobSeeker, resume, thisDate) {
		this.job = job;
		this.jobSeeker = jobSeeker;
		this.resume = resume;
		this.thisDate = thisDate;
	};	
	JobApplication.prototype.passesFilter = function(filter) {
		return hasValueObject(this, filter);
	};
	JobApplication.prototype.display = function(thisReport) {
		this.job.display(thisReport);
		this.thisDate.display(thisReport);
	};
	JobApplication.prototype.addField = function(list) {
		this.job.addField(list);
		list.append(this.thisDate);
	};
	JobApplication.prototype.addToReport = function(thisReport, filterList, fieldNames) {
		if (filterList.filter(this)) {
			var self = this;
			var theseFields = new FieldsList();
			fieldNames.addFieldsToFieldsList(self, theseFields);
			thisReport.addEntries(theseFields);
		}
	};	
	JobApplication.prototype.hasResume = function() {
		return !!this.resume; 
	};
	JobApplication.prototype.equals = function(otherObject) {
		return (this.constructor === otherObject.constructor) && (this.uid === otherObject.uid);
	};

	var jobApplicationList = new ObjectList();


//Reports
	//FILTERS
	//A list of filters.  Use .append to add a filter. 
	function FilterList() {
		ObjectList.call(this);
	}
	FilterList.prototype = Object.create(ObjectList.prototype);
	FilterList.prototype.constructor = FilterList;
	FilterList.prototype.filter = function(obj) {
		return this.list.every(obj.passesFilter.bind(obj));
	};

	function makeFilterList() {
		var filters = new FilterList();
		for (var i = 0; i < arguments.length; i++) 
			filters.append(arguments[i]);
		return filters;
	}


	//TABLES
	function FieldName(valueObject) {
		valueObject.call(this, null);
		this.constructor = valueObject;
		this.displayFieldName = this.constructor.prototype.displayFieldName;
	}

	function FieldNames() {
		ObjectList.call(this);
	}
	FieldNames.prototype = Object.create(ObjectList.prototype);
	FieldNames.prototype.constructor = FieldNames;
	FieldNames.prototype.generateTable = function(report) {
		return newTable = new Table(this);
	};
	FieldNames.prototype.addField = function(field) {
		var field = new FieldName(field);
		this.append(field);
	};
	FieldNames.prototype.addFieldsToFieldsList = function(obj, fields) {
		this.list.forEach(function(fieldName) {
			obj.addField(fieldName, fields);
		});
	};
	FieldNames.prototype.addFieldNamesToReport = function(thisReport) {
		this.list.forEach(function(item) {
			item.displayFieldName(thisReport);
		});
		thisReport.nextLine();	
	};

	function makeFieldNames() {
		var fields = new FieldNames();
		for (var i = 0; i < arguments.length; i++) 
			fields.addField(arguments[i]);
		return fields;
	}


	function FieldsList() {
		ObjectList.call(this);
	} 
	FieldsList.prototype = Object.create(ObjectList.prototype);
	FieldsList.prototype.constructor = FieldsList;
	FieldsList.prototype.addFieldNamesToReport = function(thisReport) {
		this.list.forEach(function(item) {
			item.displayFieldName(thisReport);
		});
		thisReport.nextLine();	
	};
	FieldsList.prototype.addFields = function(list) {
		this.list.forEach(function(obj) {
			list.addField(obj);
		});
	};

/*
	function Report(fieldNames) {
		this.table = fieldNames.generateTable();
	};
	Report.prototype.addEntries = function(fieldsList) {
		this.table.addRow(fieldsList);
	};
 	Report.prototype.addFieldName = function(field) {
		this.table.addFieldName(field);
	};
	Report.prototype.addRow = function(fieldsList) {
		this.table.addRow(fieldsList);		
	};
	Report.prototype.appendRow = function(row) {
		this.table.addRow(row);
	}
	Report.prototype.display = function(format) {
		return this.table.display(format);
	};

	function makeReport(report, fieldNames) {
		report.addEntries(fieldNames)
		return report.display(TextReport);	
	}
*/

	function Report(fieldNames) {
		this.fieldNames = fieldNames;
		this.fields = [];
	}
	Report.prototype.addFieldName = function(fieldName) {
		this.fieldNames.push(fieldName);
	};
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


	function Row() {
		ObjectList.call(this);
	}
	Row.prototype = Object.create(ObjectList.prototype);
	Row.prototype.constructor = Row;
	Row.prototype.addField = function(field) {
		this.append(field);
	}
	Row.prototype.addRowToReport = function(thisReport) {
		this.list.forEach(function(item) {
			item.display(thisReport);
		});
		thisReport.nextLine();
	};

	function Table(fieldNames) {
		this.fieldNames = fieldNames;
		this.rows = [];
	}
	Table.prototype.addFieldName = function(fieldName) {
		this.fieldNames.push(fieldNames);
	};
	Table.prototype.addRow = function(fieldsList) {		
		var row = new Row();
		fieldsList.addFields(row);
		this.rows.push(row);
	};
	Table.prototype.display = function(format) {
		var thisReport = new format();
		this.fieldNames.addFieldNamesToReport(thisReport);
		this.rows.forEach(function(row) {
			row.addRowToReport(thisReport);
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


//TheLadders
	var TheLadders = {
		jobCount: function() {
			return jobList.count();
		}
	}


//Value Objects
	function ValueObject(data, fieldNameString) {
		this.data = data;
	}
	ValueObject.prototype.equals = function(otherName) {
		return this.data === otherName.data;
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

	function JobType(type) {
		ValueObject.call(this, type);
	}
	JobType.prototype = Object.create(ValueObject.prototype);
	JobType.prototype.constructor = JobType;
	JobType.prototype.displayFieldName = function(report) {
		report.addEntry('Job Type');
	};

	function Uid(uid) {
		ValueObject.call(this, uid);
	}
	Uid.prototype = Object.create(ValueObject.prototype);
	Uid.prototype.constructor = Uid;
	Uid.prototype.displayFieldName = function(report) {
		report.addEntry('UID');
	};

	function FullDate(thisDate) {
		var thisDate = thisDate || generateDate();
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
	FullName.prototype.displayFieldName = function(report) {
		report.addEntry('Full Name');
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


	function areSameValueObjectType(vo1, vo2) {
		return vo1 && vo2 && vo1.constructor === vo2.constructor;
	}

	function areEqualValueObjects(vo1, vo2) {
		return areSameValueObjectType(vo1, vo2) && 
			vo1.equals(vo2);
	}

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


//Utilities
	function argumentsToArray(args) {
		return Array.prototype.slice.call(args);
	}

	function unpack(args) {
		if (args.length === 1 && args[0] instanceof Array) 
			return argumentsToArray(args[0]);  
		return argumentsToArray(args);
	}

	function containsValueObject(arr, obj) {
		return arr.some(function(member) { 
			return areEqualValueObjects(member, obj);
		});
	} 

	function hasValueObject(obj, valueObject) {
		var values = [];
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) 
				values.push(areEqualValueObjects(obj[property], valueObject));
		}
		return values.some(isTrue);
	}

	function listPropertyValues(obj) {
		var propertyValues = [];
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) 
				propertyValues.push(obj[property]);
		}
		return propertyValues;
	}

	function findValueObject(obj, fieldName) {
		return listPropertyValues(obj).filter(function(x) { 
			return areSameValueObjectType(x, fieldName); 
		})[0];
	}

	function rand(low, high) {
		return Math.floor(Math.random() * (high - low)) + low + 1;
	}

	function generateDate() {
		var day = rand(1, 30);
		var month = rand(1, 12);
		var year = rand(2012, 2300);
		return "" + month + "/" + day + "/" + year;
	}

	function methodToPredicate(obj, method) {
		return function(args) {
			return obj[method](args);
		}
	}

	function isTrue(x) {
		return x === true;
	}


//Public Methods
	var mainPublic = {
		//public methods go here
		Job: Job,
		Employer: Employer,
		Report: Report,
		jobList: jobList,
		unpack: unpack,
		ObjectList: ObjectList,
		TheLadders: TheLadders,
		Name: Name,
		FullName: FullName,
		JobType: JobType,
		Uid: Uid,
		FieldName: FieldName,
		FilterList: FilterList,
		areEqualValueObjects: areEqualValueObjects,
		areSameValueObjectType: areSameValueObjectType,
		findValueObject: findValueObject,
		TextReport: TextReport,
		HtmlReport: HtmlReport,
		CsvReport: CsvReport,
		FullDate: FullDate,
		Resume: Resume,
		JobSeeker: JobSeeker,
		JReq: JReq,
		ATS: ATS,
		savedJobsList: savedJobsList,
		jobApplicationList: jobApplicationList
	};

	return mainPublic;
}
)();

////////////////////////////////////////////////////
/*
*/
/////////////////////////////////////////////////////////////





//////////////////////////////////////////////////////////////
/*
Job
	SUBTYPES	
		JReq (requires resume)
		ATS
	Owned by Employer
	Behaviors
		Check for resume?
	Properties
		Title
		##Description

JobSeeker
	Display: name (dupes ok)
	Behaviors
		Create Resume
		##View Resumes
		View Jobs
		Apply to Job (with Resume)
		View Saved Jobs
		View Jobs applied to (with link to JobApplications)
	Properties
		Resumes
		JobApplications

Employer
	Display: name (duplicates ok)
	Behaviors
		Post Job
		See list of own Jobs
		View JobSeekers who applied (by Job and date)
	Properties
		Jobs

Resume
	Owned by JobSeeker

JobApplication
	Display: title and employer name (dupe titles ok)
	Owned by JobSeeker
	Properties
		Resume
		Job

SavedJobs
	Owned by JobSeeker

JobsAppliedTo
	Owned by JobSeeker

Collections
	JobList
	ResumeList
	JobSeekerList
	FailedApps
	SucceededApps

InternalReports
	Who applied (by date)
		-either csv or html
		-include jobseeker, job, employer, and app date
	Aggregate app numbers (by job and employer)
	How many apps failed/succeeded (by job and employer)
*/