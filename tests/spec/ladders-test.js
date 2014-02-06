function testMethod(obj, method, message) {
	console.log('*******************');
	console.log(message);
	console.log('-------------------');
	console.log((obj[method].bind(obj))());
}

describe("Names are ValueObjects", function() {
	var name1 = new valueObjects.Name('Jim');
	var name2 = new valueObjects.Name('Sally');
	var name3 = new valueObjects.Name('Jim');

	it("that can be tested for equality", function() {
		expect(utilities.areEqualValueObjects(name1, name3)).toBe(true);
	});

	it("that can be tested for equality", function() {
		expect(utilities.areEqualValueObjects(name1, name2)).toBe(false);
	});
});

describe("Uids are ValueObjects", function() {
	var uid1 = new valueObjects.Uid(10);
	var uid2 = new valueObjects.Uid(5);
	var uid3 = new valueObjects.Uid(10);

	it("that can be tested for equality", function() {
		expect(utilities.areEqualValueObjects(uid1, uid3)).toBe(true);
	});

	it("that can be tested for equality", function() {
		expect(utilities.areEqualValueObjects(uid1, uid2)).toBe(false);
	});
});

describe("Employers", function() {
	var employer = new oc.Employer('Microsoft');
	employer.postJob('engineer', oc.JReq);
	employer.postJob('boxer', oc.ATS);
	var employer2 = new oc.Employer('Apple');
	employer2.postJob('screenwriter', oc.JReq);
	employer2.postJob('copyeditor', oc.ATS);

	var jobseeker = new oc.JobSeeker(new valueObjects.FullName('Martha', 'Jones'));
	jobseeker.applyToJob(oc.jobList.list[1]);

	it("can list the jobs they posted", function() {
		expect(employer.listJobs()).toBeDefined();
	});

	testMethod(employer, 'listJobs', 'Employer lists jobs');

	it("can list the jobseekers who applied to their jobs", function() {
		expect(employer.listJobSeekersWhoApplied()).toBeDefined();
	});

	testMethod(employer, 'listJobSeekersWhoApplied', 'Employer lists job applicants');
});

describe("A jobseeker can", function() {
	var jobseeker = new oc.JobSeeker(new valueObjects.FullName('Bob', 'Smith'));
	jobseeker.createResume('resume data');
	var testJob1 = new oc.JReq(new valueObjects.Name('farmer'), new oc.Employer('Apple'));
	var testJob2 = new oc.ATS(new valueObjects.Name('advertiser'), new oc.Employer('Disney'));
	jobseeker.applyToJob(testJob1, new oc.Resume('resume 1'));
	jobseeker.applyToJob(testJob2, new oc.Resume('resume 2'));

	it("list jobs applied to", function() {
		expect(jobseeker.listJobsAppliedTo()).toBeDefined();
	});

	testMethod(jobseeker, 'listJobsAppliedTo', 'jobseeker lists jobs applied to');

	var jobToSave1 = new oc.JReq(new valueObjects.Name('astronaut'), new oc.Employer('Exxon'));
	var jobToSave2 = new oc.ATS(new valueObjects.Name('welder'), new oc.Employer('BevMo'));
	jobseeker.saveJob(jobToSave1);
	jobseeker.saveJob(jobToSave2);

	it("list saved jobs", function() {
		expect(jobseeker.listSavedJobs()).toBeDefined();
	});

	testMethod(jobseeker, 'listSavedJobs', 'jobseeker lists jobs saved');
	
	testMethod(jobseeker, 'listJobs', 'jobseeker lists all job');

});

describe("TheLadders", function() {
	it("can see how many jobs have been posted", function() {
		expect(oc.TheLadders.jobCount()).toBe(4);
	});
});

describe("FilterLists", function() {
	var newJobName = new valueObjects.Name('NEW JOB');
	var hasbro = new oc.Employer('Hasbro');
	var newJob = new oc.JReq(newJobName, hasbro);
	var nameFilter = new valueObjects.Name('NEW JOB');
	var filters = new reports.FilterList();
	filters.append(nameFilter);
	filters.append(hasbro);
	var nameFilter2 = new valueObjects.Name('wrong job');
	var filters2 = new reports.FilterList();
	filters2.append(nameFilter2);

	it("rely on an object's passesFilter method", function() {
		expect(newJob.passesFilter(nameFilter)).toBe(true);
	});

	it("can check if objects have certain properties", function() {
		expect(filters.filter(newJob)).toBe(true);
	});

	it("can check if objects don't have certain properties", function() {
		expect(filters2.filter(newJob)).toBe(false);
	});
});
