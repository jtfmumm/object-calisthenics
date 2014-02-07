var oc = (function() {
//Dependencies: utilities.js, value-objects.js, reports.js

//ENTITIES

//Jobs
	function Job(title) {
		this.title = title;
		this.uid = new valueObjects.Uid(utilities.jobUidGenerator());
	}
	Job.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this, filter);
	};
	Job.prototype.display = function(thisReport) {
		this.title.display(thisReport);
	};
	Job.prototype.displayFieldName = function(report) {
		report.addEntry('Job');
	};
	Job.prototype.equals = function(otherJob) {
		return (otherJob.constructor === Job) && (this.uid === otherJob.uid);
	};

	function JReq(title, employer) {
		Job.call(this, title, employer);
	}
	JReq.prototype = Object.create(Job.prototype);
	JReq.prototype.isValidApplication = function(application) {
		return application.hasResume();
	}; 

	function ATS(title, employer) {
		Job.call(this, title, employer);
	}
	ATS.prototype = Object.create(Job.prototype);
	ATS.prototype.isValidApplication = function(application) {
		return true;
	};


	function JobWithCount(job, count) {
		this.job = job;
		this.count = count;
	};
	JobWithCount.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this, filter);
	};
	JobWithCount.prototype.display = function(thisReport) {
		this.job.display(thisReport);
		this.count.display(thisReport);
	};


//Employers 
	function Employer(name) {
		this.name = new valueObjects.Name(name);
		this.uid = new valueObjects.Uid(utilities.employerUidGenerator());
	};
	Employer.prototype.display = function(thisReport) {
		this.name.display(thisReport);
	};
	Employer.prototype.displayFieldName = function(report) {
		report.addEntry('Employer');
	};
	Employer.prototype.postJob = function(title, type) {
		var title = new valueObjects.JobTitle(title);
		var newJob = new type(title);
		var newPostedJob = new PostedJob(newJob, this);
		postedJobsList.append(newPostedJob);
	};
	Employer.prototype.listJobs = function(format) {
		var fields = new reports.FieldNames(valueObjects.JobTitle, Employer);
		var report = new reports.Report(fields);
		var filters = new reports.FilterList(this);
		postedJobsList.addFields(report, filters);
		return report.display(format);
	};
	Employer.prototype.listJobSeekersWhoApplied = function(format) {		
		var fields = new reports.FieldNames(valueObjects.Name, Job, Employer, valueObjects.FullDate);
		var report = new reports.Report(fields);
		var filters = new reports.FilterList();
		jobApplicationList.addFields(report, filters);
		return report.display(format);
	};
	Employer.prototype.equals = function(otherEmployer) {
		return (otherEmployer.constructor === Employer) && (this.uid === otherEmployer.uid);
	};

	var employerList = new valueObjects.ObjectList();

	function PostedJob(job, employer) {
		this.job = job;
		this.employer = employer;
	}
	PostedJob.prototype.equals = function(filter) {
		return utilities.hasValueObject(this, filter);
	};
	PostedJob.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this, filter)
			|| utilities.hasValueObject(this.job, filter) 
			|| utilities.hasValueObject(this.employer, filter);
	};
	PostedJob.prototype.display = function(thisReport) {
		this.job.display(thisReport);
		this.employer.display(thisReport);
	};
	PostedJob.prototype.displayFieldName = function(report) {
		report.addEntry('Job');
		report.addEntry('Employer');
	};	
	PostedJob.prototype.applicationCount = function() {
		return jobApplicationList.countByJob(this);
	};
	PostedJob.prototype.isValidApplication = function(application) {
		return this.job.isValidApplication(application);
	}
	PostedJob.prototype.equals = function(otherPostedJob) {
		return (otherPostedJob.constructor === PostedJob) && (this.job.equals(otherPostedJob.job));
	};

	var postedJobsList = new valueObjects.ObjectList();
	postedJobsList.makeCountList = function() {
		//Make a list of jobWithCounts, one for each job
		var jobWithCountList = new valueObjects.ObjectList();
		this.list.forEach(function(job) {
			var count = job.applicationCount();
			var jobWithCount = new JobWithCount(job, count);
			jobWithCountList.append(jobWithCount);
		});
		return jobWithCountList;
	};

//Jobseekers
	function JobSeeker(name) {
		this.name = name;
		this.uid = new valueObjects.Uid(utilities.jobSeekerUidGenerator());
	}
	JobSeeker.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this, filter);
	};
	JobSeeker.prototype.display = function(thisReport) {
		this.name.display(thisReport);
	};
	JobSeeker.prototype.createResume = function(resume) {
		var thisResume = new Resume(resume, this);
		resumeList.append(thisResume);
	};
	JobSeeker.prototype.ownResumes = function() {
		var theseResumes = new valueObjects.ObjectList();
		var filters = new reports.FilterList();
		filters.append(this);
		resumeList.tellEach('addToList', [filters, theseResumes]);
		return theseResumes;
	};
	JobSeeker.prototype.saveJob = function(job) {
		var thisSavedJob = new SavedJob(job, this);
		savedJobsList.append(thisSavedJob);
	} 
	JobSeeker.prototype.applyToJob = function(job, resume) {
		var thisDate = new valueObjects.FullDate(utilities.generateDate());
		var thisResume = resume || new Resume();
		var thisApplication = new JobApplication(job, this, thisResume, thisDate);
		if (job.isValidApplication(thisApplication)) 
			jobApplicationList.append(thisApplication);
	};
	JobSeeker.prototype.listJobs = function(format) {
		var fields = new reports.FieldNames(valueObjects.JobTitle, Employer);
		var report = new reports.Report(fields);
		var filters = new reports.FilterList();
		postedJobsList.addFields(report, filters);
		return report.display(format);
	};
	JobSeeker.prototype.listSavedJobs = function(format) {
		var fields = new reports.FieldNames(valueObjects.JobTitle, Employer);
		var report = new reports.Report(fields);
		var filters = new reports.FilterList(this);
		savedJobsList.addFields(report, filters);
		return report.display(format);
	};
	JobSeeker.prototype.listJobsAppliedTo = function(format) {
		var fields = new reports.FieldNames(valueObjects.Name, valueObjects.JobTitle, Employer, valueObjects.FullDate);
		var report = new reports.Report(fields);
		var filters = new reports.FilterList(this);
		jobApplicationList.addFields(report, filters);
		return report.display(format);
	};
	JobSeeker.prototype.equals = function(otherJobSeeker) {
		return (otherJobSeeker.constructor === JobSeeker) && (this.uid === otherJobSeeker.uid);
	};

	function SavedJob(job, jobSeeker) {
		this.job = job;
		this.jobSeeker = jobSeeker;
	}
	SavedJob.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this, filter);
	};
	SavedJob.prototype.display = function(thisReport) {
		this.job.display(thisReport);
	};	

	var jobSeekerList = new valueObjects.ObjectList();
	var savedJobsList = new valueObjects.ObjectList();


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
		return utilities.hasValueObject(this, filter);
	};
	Resume.prototype.display = function(thisReport) {
		thisReport.addEntry(this.resume);
	};
	Resume.prototype.equals = function(otherResume) {
		return this.constructor === otherResume.constructor 
			&& this.resume === otherResume.resume 
			&& this.jobSeeker === otherResume.jobSeeker;
	};

	var resumeList = new valueObjects.ObjectList();


//JobApplications
	function JobApplication(job, jobSeeker, resume, thisDate) {
		this.job = job;
		this.jobSeeker = jobSeeker;
		this.resume = resume;
		this.thisDate = thisDate;
	};	
	JobApplication.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this, filter);
	};
	JobApplication.prototype.display = function(thisReport) {
		this.jobSeeker.display(thisReport);
		this.job.display(thisReport);
		this.thisDate.display(thisReport);
	};	
	JobApplication.prototype.hasResume = function() {
		return !!this.resume; 
	};
	JobApplication.prototype.equals = function(otherJobApplication) {
		return (otherJobApplication.constructor === JobApplication) && (this.uid === otherJobApplication.uid);
	};

	var jobApplicationList = new valueObjects.ObjectList();
	jobApplicationList.countByJob = function(job) {
		var count = 0;
		var filter = job;
		this.list.forEach(function(application) {
			if (application.passesFilter(filter))
				count++;
		});
		return new valueObjects.Count(count);
	};


//TheLadders
	var TheLadders = {
		jobCount: function() {
			return postedJobsList.count();
		},
		listJobApplicationsByDate: function(format) {
			var fields = new reports.FieldNames(valueObjects.Name, valueObjects.JobTitle, Employer, valueObjects.FullDate);
			var report = new reports.Report(fields);
			var filters = new reports.FilterList();
			jobApplicationList.addFields(report, filters);
			return report.display(format);			
		},
		listAggregateJobNumbers: function(format) {
			var fields = new reports.FieldNames(valueObjects.JobTitle, Employer, valueObjects.Count);
			var report = new reports.Report(fields);
			var filters = new reports.FilterList();
			var countList = postedJobsList.makeCountList();
			countList.addFields(report, filters);
			return report.display(format);
		},
		listJobApplicationsForOneDate: function(format, fullDate) {
			var fields = new reports.FieldNames(valueObjects.Name, valueObjects.JobTitle, Employer, valueObjects.FullDate);
			var report = new reports.Report(fields);
			var filters = new reports.FilterList(fullDate);
			jobApplicationList.addFields(report, filters);
			return report.display(format);					
		}

	}


	var oc = {
		ATS: ATS,
		JReq: JReq,
		Employer: Employer,
		JobSeeker: JobSeeker,
		JobApplication: JobApplication,
		Resume: Resume,
		TheLadders: TheLadders,
		//For testing
		Job: Job,
		PostedJob: PostedJob,
		jobApplicationList: jobApplicationList,
		postedJobsList: postedJobsList
	}

	return oc;

})();