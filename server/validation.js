const { z } = require('zod');

const coordinatesSchema = z.array(z.number().finite()).length(2).refine(
  ([longitude, latitude]) => longitude >= -180 && longitude <= 180 && latitude >= -90 && latitude <= 90,
  { message: 'Coordinates must be [longitude, latitude] within valid ranges' }
);

const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name must be 80 characters or fewer'),
  email: z.string().trim().email('Please provide a valid email').max(254, 'Email is too long'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128, 'Password is too long'),
  role: z.enum(['client', 'worker'], { message: 'Role must be client or worker' }),
  skill: z.string().trim().max(50, 'Skill must be 50 characters or fewer').optional(),
  coordinates: coordinatesSchema.optional()
}).superRefine((data, context) => {
  if (data.role === 'worker' && !data.skill) {
    context.addIssue({ code: 'custom', path: ['skill'], message: 'Skill is required for workers' });
  }
});

const loginSchema = z.object({
  email: z.string().trim().email('Please provide a valid email').max(254, 'Email is too long'),
  password: z.string().min(1, 'Password is required').max(128, 'Password is too long')
});

const createJobSchema = z.object({
  title: z.string().trim().min(1, 'Job title is required').max(120, 'Job title must be 120 characters or fewer'),
  description: z.string().trim().min(1, 'Job description is required').max(2000, 'Job description must be 2000 characters or fewer'),
  skill: z.string().trim().min(1, 'Skill is required').max(50, 'Skill must be 50 characters or fewer'),
  coordinates: coordinatesSchema
});

const jobIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid job ID')
});

const completeJobSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5').optional(),
  review: z.string().trim().min(1, 'Review is required').max(1000, 'Review must be 1000 characters or fewer').optional()
}).optional();

const reviewSchema = z.object({
  rating: z.number().int().min(1, 'Rating must be between 1 and 5').max(5, 'Rating must be between 1 and 5'),
  review: z.string().trim().min(1, 'Review is required').max(1000, 'Review must be 1000 characters or fewer')
});

const startJobSchema = z.object({});

const cancelJobSchema = z.object({
  reason: z.string().trim().max(500, 'Cancellation reason must be 500 characters or fewer').optional()
});

const validate = (schema, source = 'body') => (req, res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) {
    return res.status(400).json({ message: result.error.issues[0]?.message || 'Invalid request data' });
  }

  req[source] = result.data;
  next();
};

module.exports = {
  registerSchema,
  loginSchema,
  createJobSchema,
  jobIdSchema,
  completeJobSchema,
  reviewSchema,
  startJobSchema,
  cancelJobSchema,
  validate
};
