import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection } from "@aws-amplify/datastore";



type EagerLineItem = {
  readonly category: string;
  readonly item: string;
  readonly unitCost: number;
  readonly quantity: number;
  readonly lineTotal?: number | null;
}

type LazyLineItem = {
  readonly category: string;
  readonly item: string;
  readonly unitCost: number;
  readonly quantity: number;
  readonly lineTotal?: number | null;
}

export declare type LineItem = LazyLoading extends LazyLoadingDisabled ? EagerLineItem : LazyLineItem

export declare const LineItem: (new (init: ModelInit<LineItem>) => LineItem)

type EagerUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly username: string;
  readonly email?: string | null;
  readonly farmName?: string | null;
  readonly phone?: string | null;
  readonly aboutMe?: string | null;
  readonly profilePictureKey?: string | null;
  readonly role?: string | null;
  readonly preferences?: string | null;
  readonly owner?: string | null;
  readonly expenses?: (Expense | null)[] | null;
  readonly income?: (Income | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUser = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<User, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly username: string;
  readonly email?: string | null;
  readonly farmName?: string | null;
  readonly phone?: string | null;
  readonly aboutMe?: string | null;
  readonly profilePictureKey?: string | null;
  readonly role?: string | null;
  readonly preferences?: string | null;
  readonly owner?: string | null;
  readonly expenses: AsyncCollection<Expense>;
  readonly income: AsyncCollection<Income>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type User = LazyLoading extends LazyLoadingDisabled ? EagerUser : LazyUser

export declare const User: (new (init: ModelInit<User>) => User) & {
  copyOf(source: User, mutator: (draft: MutableModel<User>) => MutableModel<User> | void): User;
}

type EagerExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Expense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly date: string;
  readonly vendor: string;
  readonly grandTotal?: number | null;
  readonly description?: string | null;
  readonly receiptImageKey?: string | null;
  readonly lineItems: LineItem[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userExpensesId?: string | null;
}

type LazyExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Expense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly date: string;
  readonly vendor: string;
  readonly grandTotal?: number | null;
  readonly description?: string | null;
  readonly receiptImageKey?: string | null;
  readonly lineItems: LineItem[];
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userExpensesId?: string | null;
}

export declare type Expense = LazyLoading extends LazyLoadingDisabled ? EagerExpense : LazyExpense

export declare const Expense: (new (init: ModelInit<Expense>) => Expense) & {
  copyOf(source: Expense, mutator: (draft: MutableModel<Expense>) => MutableModel<Expense> | void): Expense;
}

type EagerIncome = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Income, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly date: string;
  readonly quantity: number;
  readonly price: number;
  readonly paymentMethod?: string | null;
  readonly amount: number;
  readonly item?: string | null;
  readonly notes?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userIncomeId?: string | null;
}

type LazyIncome = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Income, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userId: string;
  readonly date: string;
  readonly quantity: number;
  readonly price: number;
  readonly paymentMethod?: string | null;
  readonly amount: number;
  readonly item?: string | null;
  readonly notes?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly userIncomeId?: string | null;
}

export declare type Income = LazyLoading extends LazyLoadingDisabled ? EagerIncome : LazyIncome

export declare const Income: (new (init: ModelInit<Income>) => Income) & {
  copyOf(source: Income, mutator: (draft: MutableModel<Income>) => MutableModel<Income> | void): Income;
}