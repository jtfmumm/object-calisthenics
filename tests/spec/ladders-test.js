xdescribe("A Job", function() {
});

describe("Unpack", function() {
	it("unpacks an array containing exactly one array", function() {
		expect(oc.unpack([[1, 2]])).toEqual([1, 2]);
	});

	it("should not unpack otherwise", function() {
		expect(oc.unpack([[1], [2]])).not.toEqual([1]);
	})
});

describe("ObjectLists", function() {
	var ol = new oc.ObjectList();
	var talker = {
		talk: function(word) { console.log(word); }
	}

	var yeller = {
		talk: function(word) { console.log(word.toUpperCase()); }
	}

	function isAnObject(x) {
		return x && typeof x === 'object';
	}

	ol.append(talker);
	ol.append(yeller);

	it("can test every item against a predicate", function() {
		expect(ol.every(isAnObject)).toBe(true);
	});

	ol.tellEach('talk', ['hello console!']);
});

describe("Names are ValueObjects", function() {
	var name1 = new oc.Name('Jim');
	var name2 = new oc.Name('Sally');
	var name3 = new oc.Name('Jim');

	it("that can be tested for equality", function() {
		expect(oc.areEqualValueObjects(name1, name3)).toBe(true);
	});

	it("that can be tested for equality", function() {
		expect(oc.areEqualValueObjects(name1, name2)).toBe(false);
	});
});

describe("JobTypes are ValueObjects", function() {
	var type1 = new oc.JobType('JReq');
	var type2 = new oc.JobType('ATS');
	var type3 = new oc.JobType('JReq');

	it("that can be tested for equality", function() {
		expect(oc.areEqualValueObjects(type1, type3)).toBe(true);
	});

	it("that can be tested for equality", function() {
		expect(oc.areEqualValueObjects(type1, type2)).toBe(false);
	});
});

describe("Uids are ValueObjects", function() {
	var uid1 = new oc.Uid(10);
	var uid2 = new oc.Uid(5);
	var uid3 = new oc.Uid(10);

	it("that can be tested for equality", function() {
		expect(oc.areEqualValueObjects(uid1, uid3)).toBe(true);
	});

	it("that can be tested for equality", function() {
		expect(oc.areEqualValueObjects(uid1, uid2)).toBe(false);
	});

	console.log(new oc.Uid(10));
});

describe("An employer's list of jobs", function() {
	var employer = new oc.Employer();
	employer.postJob('engineer', oc.JReq);
	employer.postJob('boxer', oc.ATS);

	console.log("There are " + oc.jobList.count() + " jobs posted.");

	it("should now have stuff", function() {
		expect(oc.jobList.list).toBeDefined();
	});

	it("should now have two items", function() {
		expect(oc.jobList.count()).toBe(2);
	});

	it("should contain titles", function() {
		expect(employer.listJobs()).toBeDefined();
	});

	console.log(employer.listJobs());
});

describe("A jobseeker can", function() {
	var jobseeker = new oc.JobSeeker(new oc.FullName(new oc.Name('Bob'), new oc.Name('Smith')));
	jobseeker.createResume('resume data');
	var testJob1 = new oc.JReq(new oc.Name('farmer'), new oc.Uid(15));
	var testJob2 = new oc.ATS(new oc.Name('advertiser'), new oc.Uid(15));
	jobseeker.applyToJob(testJob1, new oc.Resume('resume 1'));
	jobseeker.applyToJob(testJob2, new oc.Resume('resume 2'));

	it("list jobs applied to", function() {
		expect(jobseeker.listJobsAppliedTo()).toBeDefined();
	});
	console.log(jobseeker.listJobsAppliedTo());

	var jobToSave1 = new oc.JReq(new oc.Name('astronaut'), new oc.Uid(17));
	var jobToSave2 = new oc.ATS(new oc.Name('welder'), new oc.Uid(10));
	jobseeker.saveJob(jobToSave1);
	jobseeker.saveJob(jobToSave2);

	it("list saved jobs", function() {
		expect(jobseeker.listSavedJobs()).toBeDefined();
	});
	console.log(jobseeker.listSavedJobs());
});

describe("TheLadders", function() {
	it("can see how many jobs have been posted", function() {
		expect(oc.TheLadders.jobCount()).toBe(2);
	});
});

describe("FilterLists", function() {
	var newJobName = new oc.Name('NEW JOB');
	var newEmployerId = new oc.Uid(10);
	var newJob = new oc.JReq(newJobName, newEmployerId);
	var nameFilter = new oc.Name('NEW JOB');
	var filters = new oc.FilterList();
	filters.append(nameFilter);
	filters.append(new oc.Uid(10));
	var nameFilter2 = new oc.Name('wrong job');
	var filters2 = new oc.FilterList();
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
