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


//Employers 
	function Employer(name) {
		this.name = new valueObjects.Name(name);
		this.uid = new valueObjects.Uid(utilities.employerUidGenerator());
	};
	Employer.prototype.display = function(thisReport) {
		this.name.display(thisReport);
	};
	Employer.prototype.createJob = function(title, type) {
		return new type(new valueObjects.Name(title));
	};
	Employer.prototype.postJob = function(job) {
		var newPostedJob = new PostedJob(job, this);
		postedJobsList.append(newPostedJob);
	};
	Employer.prototype.listJobs = function(format) {
		var report = new reports.Report("Job Title", "Employer");
		var filters = new reports.FilterList(this);
		postedJobsList.addToReport(report, filters);
		return report.display(format);
	};
	Employer.prototype.listJobSeekersWhoApplied = function(format) {		
		var report = new reports.Report("Name", "Job Title", "Employer", "Date");
		var filters = new reports.FilterList();
		processedApplicationList.addToReport(report, filters);
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
	PostedJob.prototype.succeededApplicationCount = function() {
		return processedApplicationList.countSuccessesByJob(this);
	};
	PostedJob.prototype.failedApplicationCount = function() {
		return processedApplicationList.countFailuresByJob(this);
	};
	PostedJob.prototype.isValidApplication = function(application) {
		return this.job.isValidApplication(application);
	}
	PostedJob.prototype.equals = function(otherPostedJob) {
		return (otherPostedJob.constructor === PostedJob) && (this.job.equals(otherPostedJob.job));
	};

	var postedJobsList = new valueObjects.ObjectList();


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
		if (resume == null || this.ownResumes().passesFilter(resume)) {
			var thisResume = resume || nullResume;
			var thisApplication = new JobApplication(job, this, thisResume, thisDate);
			var processed = new ProcessedApplication(thisApplication, thisApplication.isValidApplication());
			processedApplicationList.append(processed);
		}
	};
	JobSeeker.prototype.listJobs = function(format) {
		var report = new reports.Report("Job Title", "Employer");
		var filters = new reports.FilterList();
		postedJobsList.addToReport(report, filters);
		return report.display(format);
	};
	JobSeeker.prototype.listSavedJobs = function(format) {
		var report = new reports.Report("Job Title", "Employer");
		var filters = new reports.FilterList(this);
		savedJobsList.addToReport(report, filters);
		return report.display(format);
	};
	JobSeeker.prototype.listJobsAppliedTo = function(format) {
		var report = new reports.Report("Name", "Job Title", "Employer", "Date");
		var filters = new reports.FilterList(this);
		processedApplicationList.addToReport(report, filters);
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
		return this.resume === filter ||
			this.jobSeeker.equals(filter);
	};
	Resume.prototype.display = function(thisReport) {
		thisReport.addEntry(this.resume);
	};
	Resume.prototype.isNotNull = function() {
		return this.resume != undefined;
	};
	Resume.prototype.equals = function(otherResume) {
		return this.constructor === otherResume.constructor 
			&& this.resume === otherResume.resume 
			&& this.jobSeeker === otherResume.jobSeeker;
	};

	var nullResume = new Resume();
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
		return this.resume.isNotNull(); 
	};
	JobApplication.prototype.equals = function(otherJobApplication) {
		return (otherJobApplication.constructor === JobApplication) && (this.uid === otherJobApplication.uid);
	};
	JobApplication.prototype.isValidApplication = function() {
		return this.job.isValidApplication(this);
	};

	function ProcessedApplication(application, isSuccessful) {
		this.application = application;
		this.success = isSuccessful;
	}	
	ProcessedApplication.prototype.passesFilter = function(filter) {
		return utilities.hasValueObject(this.application, filter);
	};
	ProcessedApplication.prototype.display = function(thisReport) {
		this.application.display(thisReport);
	};	
	ProcessedApplication.prototype.isSuccessful = function() {
		return this.success;
	};
	ProcessedApplication.prototype.equals = function(otherProcessedApplication) {
		return (otherProcessedApplication.constructor === ProcessedApplication) 
			&& (this.application.equals(otherProcessedApplication.application));
	};


	var processedApplicationList = new valueObjects.ObjectList();
	processedApplicationList.successful = function() {
		return this.list.filter(function(application) {
			return application.isSuccessful();
		});
	};
	processedApplicationList.failed = function() {
		return this.list.filter(function(application) {
			return !application.isSuccessful();
		});
	};
	processedApplicationList.addToReport = function(report, filterList) {
		this.successful().forEach(function(application) {
			if (filterList.filter(application)) 
				report.addToReport(application);
		});
	};
	processedApplicationList.countSuccessesByJob = function(job) {
			var count = 0;
			var filter = job;
			this.successful().forEach(function(application) {
				if (application.passesFilter(filter))
					count++;
			});
			return new valueObjects.Count(count);
	};
	processedApplicationList.countFailuresByJob = function(job) {
			var count = 0;
			var filter = job;
			this.failed().forEach(function(application) {
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
			var report = new reports.Report('Name', 'Job Title', 'Employer', 'Date');
			var filters = new reports.FilterList();
			processedApplicationList.addToReport(report, filters);
			return report.display(format);			
		},
		listAggregateJobNumbers: function(format) {
			var report = new reports.Report('Job Title', 'Employer', 'Count');
			var filters = new reports.FilterList();
			postedJobsList.forEach(function(postedJob) {
				var count = postedJob.succeededApplicationCount();
				report.addToReport(postedJob, count);
			});
			return report.display(format);
		},
		listJobApplicationsForOneDate: function(format, fullDate) {
			var report = new reports.Report('Name', 'Job Title', 'Employer', 'Date');
			var filters = new reports.FilterList(fullDate);
			processedApplicationList.addToReport(report, filters);
			return report.display(format);					
		},
		listJobApplicationsForOneJob: function(format, job) {
			var report = new reports.Report('Name', 'Job Title', 'Employer', 'Date');
			var filters = new reports.FilterList(job);
			processedApplicationList.addToReport(report, filters);
			return report.display(format);					
		},
		listJobApplicationsForOneJobAndDate: function(format, job, fullDate) {
			var report = new reports.Report('Name', 'Job Title', 'Employer', 'Date');
			var filters = new reports.FilterList(job, fullDate);
			processedApplicationList.addToReport(report, filters);
			return report.display(format);					
		},
		listJobApplicationsSuccessesAndFailures: function(format, fullDate) {
			var report = new reports.Report('Job Title', 'Employer', 'Successful', 'Failed');
			var filters = new reports.FilterList();
			postedJobsList.forEach(function(postedJob) {
				var succeededCount = postedJob.succeededApplicationCount();
				var failedCount = postedJob.failedApplicationCount();
				report.addToReport(postedJob, succeededCount, failedCount);
			})
			return report.display(format);	
		}

	}


	var oc = {
		ATS: ATS,
		JReq: JReq,
		Employer: Employer,
		JobSeeker: JobSeeker,
		JobApplication: JobApplication,
		ProcessedApplication: ProcessedApplication,
		Resume: Resume,
		TheLadders: TheLadders,
		//For testing
		Job: Job,
		PostedJob: PostedJob,
		processedApplicationList: processedApplicationList,
		postedJobsList: postedJobsList
	}

	return oc;

})();