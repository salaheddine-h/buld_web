const mongoose = require('mongoose');
const slugify = require('slugify');

const matchSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A match must have a title'],
      trim: true,
      maxlength: [100, 'A match title cannot exceed 100 characters']
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'A match must have a description'],
      trim: true
    },
    sport: {
      type: String,
      required: [true, 'A match must specify a sport'],
      enum: ['soccer', 'basketball', 'tennis', 'football', 'baseball', 'mma', 'boxing', 'racing', 'golf', 'other']
    },
    categories: [{
      type: mongoose.Schema.ObjectId,
      ref: 'Category'
    }],
    teams: [
      {
        name: String,
        logo: String,
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    scheduledTime: {
      type: Date,
      required: [true, 'A match must have a scheduled time']
    },
    endTime: Date,
    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled', 'postponed'],
      default: 'scheduled'
    },
    streamUrl: String,
    posterImage: {
      type: String,
      required: [true, 'A match must have a poster image']
    },
    bannerImage: String,
    venue: {
      name: String,
      location: String,
      coordinates: {
        type: [Number],
        index: '2dsphere'
      }
    },
    isHighlighted: {
      type: Boolean,
      default: false
    },
    isPremium: {
      type: Boolean,
      default: false
    },
    tournament: {
      name: String,
      logo: String
    },
    commentators: [String],
    views: {
      type: Number,
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create indexes for better query performance
matchSchema.index({ title: 'text', description: 'text' });
matchSchema.index({ slug: 1 });
matchSchema.index({ sport: 1 });
matchSchema.index({ status: 1 });
matchSchema.index({ scheduledTime: 1 });
matchSchema.index({ categories: 1 });
matchSchema.index({ isHighlighted: 1 });
matchSchema.index({ 'venue.coordinates': '2dsphere' });

// Create slug before saving
matchSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Virtual field for determining if a match is happening soon (within 24 hours)
matchSchema.virtual('isSoon').get(function() {
  if (this.status === 'scheduled') {
    const now = new Date();
    const diff = this.scheduledTime - now;
    return diff > 0 && diff <= 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  }
  return false;
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;
