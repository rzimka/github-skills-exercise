import mongoose from 'mongoose';
import User from '../models/User';
import Team from '../models/Team';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Workout from '../models/Workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
    ]);

    const users = await User.insertMany([
      {
        name: 'Mia Park',
        email: 'mia.park@octofit.test',
        city: 'Seattle',
        fitnessLevel: 'intermediate',
        goals: ['Build endurance', 'Run a 10K under 55 minutes'],
      },
      {
        name: 'Diego Alvarez',
        email: 'diego.alvarez@octofit.test',
        city: 'Austin',
        fitnessLevel: 'advanced',
        goals: ['Improve cycling power', 'Maintain weekly consistency'],
      },
      {
        name: 'Anika Singh',
        email: 'anika.singh@octofit.test',
        city: 'Chicago',
        fitnessLevel: 'beginner',
        goals: ['Establish routine', 'Increase daily activity'],
      },
      {
        name: 'Noah Brooks',
        email: 'noah.brooks@octofit.test',
        city: 'Denver',
        fitnessLevel: 'intermediate',
        goals: ['Strength progression', 'Mobility and recovery'],
      },
    ]);

    const [mia, diego, anika, noah] = users;
    if (!mia || !diego || !anika || !noah) {
      throw new Error('Failed to create all user seed records');
    }

    const teams = await Team.insertMany([
      {
        name: 'Summit Striders',
        motto: 'Climb higher every week.',
        members: [mia._id, noah._id],
        weeklyPoints: 310,
      },
      {
        name: 'Velocity Crew',
        motto: 'Fast legs, focused minds.',
        members: [diego._id, anika._id],
        weeklyPoints: 275,
      },
    ]);

    const [summitStriders, velocityCrew] = teams;
    if (!summitStriders || !velocityCrew) {
      throw new Error('Failed to create all team seed records');
    }

    await User.updateOne({ _id: mia._id }, { team: summitStriders._id });
    await User.updateOne({ _id: noah._id }, { team: summitStriders._id });
    await User.updateOne({ _id: diego._id }, { team: velocityCrew._id });
    await User.updateOne({ _id: anika._id }, { team: velocityCrew._id });

    await Activity.insertMany([
      {
        user: mia._id,
        team: summitStriders._id,
        type: 'run',
        durationMinutes: 48,
        caloriesBurned: 510,
        distanceKm: 8.6,
        performedAt: new Date('2026-08-25T07:20:00.000Z'),
        notes: 'Tempo intervals at threshold pace.',
      },
      {
        user: diego._id,
        team: velocityCrew._id,
        type: 'ride',
        durationMinutes: 62,
        caloriesBurned: 640,
        distanceKm: 24.3,
        performedAt: new Date('2026-08-26T18:10:00.000Z'),
        notes: 'Hill repeats with high cadence finish.',
      },
      {
        user: anika._id,
        team: velocityCrew._id,
        type: 'walk',
        durationMinutes: 35,
        caloriesBurned: 210,
        distanceKm: 3.2,
        performedAt: new Date('2026-08-27T12:00:00.000Z'),
        notes: 'Lunch break walk to maintain streak.',
      },
      {
        user: noah._id,
        team: summitStriders._id,
        type: 'strength',
        durationMinutes: 55,
        caloriesBurned: 430,
        distanceKm: 0,
        performedAt: new Date('2026-08-27T06:45:00.000Z'),
        notes: 'Lower-body day with progressive overload.',
      },
      {
        user: mia._id,
        team: summitStriders._id,
        type: 'yoga',
        durationMinutes: 30,
        caloriesBurned: 120,
        distanceKm: 0,
        performedAt: new Date('2026-08-28T06:10:00.000Z'),
        notes: 'Recovery flow focused on hips and hamstrings.',
      },
    ]);

    await Leaderboard.insertMany([
      {
        periodLabel: 'Week 35, 2026',
        startsOn: new Date('2026-08-24T00:00:00.000Z'),
        endsOn: new Date('2026-08-30T23:59:59.000Z'),
        entries: [
          { user: diego._id, points: 168, rank: 1 },
          { user: mia._id, points: 152, rank: 2 },
          { user: noah._id, points: 141, rank: 3 },
          { user: anika._id, points: 119, rank: 4 },
        ],
      },
    ]);

    await Workout.insertMany([
      {
        title: 'Endurance Builder 45',
        focus: 'Cardio endurance',
        intensity: 'moderate',
        durationMinutes: 45,
        equipment: ['Running shoes', 'Watch'],
        instructions: [
          'Warm up for 10 minutes at an easy pace.',
          'Run 5 x 4 minutes at steady tempo with 2 minutes easy recovery.',
          'Cool down for 5 minutes and stretch calves/hips.',
        ],
      },
      {
        title: 'Strength Core Circuit',
        focus: 'Full-body strength',
        intensity: 'high',
        durationMinutes: 40,
        equipment: ['Dumbbells', 'Mat'],
        instructions: [
          'Complete 4 rounds of goblet squat, push-up, and bent-over row.',
          'Hold a 45-second plank after each round.',
          'Rest 60 seconds between rounds and log your reps.',
        ],
      },
      {
        title: 'Mobility Reset',
        focus: 'Recovery and flexibility',
        intensity: 'low',
        durationMinutes: 25,
        equipment: ['Yoga mat'],
        instructions: [
          'Start with cat-cow and thoracic rotations for 5 minutes.',
          'Flow through lunges, hamstring stretches, and hip openers.',
          'Finish with deep breathing for 3 minutes.',
        ],
      },
    ]);

    const [userCount, teamCount, activityCount, leaderboardCount, workoutCount] = await Promise.all([
      User.countDocuments(),
      Team.countDocuments(),
      Activity.countDocuments(),
      Leaderboard.countDocuments(),
      Workout.countDocuments(),
    ]);

    console.log('Seed summary:', {
      users: userCount,
      teams: teamCount,
      activities: activityCount,
      leaderboard: leaderboardCount,
      workouts: workoutCount,
    });

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
