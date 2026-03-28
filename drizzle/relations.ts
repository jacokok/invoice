import { relations } from "drizzle-orm/relations";
import { userBak, sessionBak, timeBak, projectBak, userDetailBak } from "./schema";

export const sessionBakRelations = relations(sessionBak, ({one}) => ({
	userBak: one(userBak, {
		fields: [sessionBak.userId],
		references: [userBak.id]
	}),
}));

export const userBakRelations = relations(userBak, ({many}) => ({
	sessionBaks: many(sessionBak),
	timeBaks: many(timeBak),
	userDetailBaks: many(userDetailBak),
	projectBaks: many(projectBak),
}));

export const timeBakRelations = relations(timeBak, ({one}) => ({
	userBak: one(userBak, {
		fields: [timeBak.userId],
		references: [userBak.id]
	}),
	projectBak: one(projectBak, {
		fields: [timeBak.projectId],
		references: [projectBak.id]
	}),
}));

export const projectBakRelations = relations(projectBak, ({one, many}) => ({
	timeBaks: many(timeBak),
	userBak: one(userBak, {
		fields: [projectBak.userId],
		references: [userBak.id]
	}),
}));

export const userDetailBakRelations = relations(userDetailBak, ({one}) => ({
	userBak: one(userBak, {
		fields: [userDetailBak.userId],
		references: [userBak.id]
	}),
}));