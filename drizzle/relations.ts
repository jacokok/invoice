import { relations } from "drizzle-orm/relations";
import { user, session, time, project, userDetail } from "./schema";

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	sessions: many(session),
	times: many(time),
	userDetails: many(userDetail),
	projects: many(project),
}));

export const timeRelations = relations(time, ({one}) => ({
	user: one(user, {
		fields: [time.userId],
		references: [user.id]
	}),
	project: one(project, {
		fields: [time.projectId],
		references: [project.id]
	}),
}));

export const projectRelations = relations(project, ({one, many}) => ({
	times: many(time),
	user: one(user, {
		fields: [project.userId],
		references: [user.id]
	}),
}));

export const userDetailRelations = relations(userDetail, ({one}) => ({
	user: one(user, {
		fields: [userDetail.userId],
		references: [user.id]
	}),
}));