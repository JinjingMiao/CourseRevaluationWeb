const ErrorResponse = require('../utils/errorResponse');

const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @ desc Get a course
// @route GET /api/v1/couse/:id
// @access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const courses = await Course.findById(req.params.id);
  if (!courses) {
    return next(
      new ErrorResponse(`Course not found with id of  ${req.parms.id}`, 404)
    );
    //res.status(400).json({ success: false });
  }
  res.status(200).json({
    success: true,
    message: `show course ${req.params.id}`,
    data: courses,
  });
});

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`),
      404
    );
  }

  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      ErrorResponse(
        `User  ${req.parms.id} is not authorized to add a course to ${bootcamp._id} `,
        401
      )
    );
  }
  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Update course
// @route     PUT /api/v1/courses/:id
// @access    Private
exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      ErrorResponse(
        `User  ${req.parms.id} is not authorized to update a course to ${course._id} `,
        401
      )
    );
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc      Delete course
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course with the id of ${req.params.id}`),
      404
    );
  }
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      ErrorResponse(
        `User  ${req.parms.id} is not authorized to delete a course to ${course._id} `,
        401
      )
    );
  }

  await course.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
