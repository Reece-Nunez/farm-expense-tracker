import { ModelInit, MutableModel, __modelMeta__, ManagedIdentifier } from "@aws-amplify/datastore";
// @ts-ignore
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





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
  readonly sub: string;
  readonly userId: string;
  readonly date: string;
  readonly vendor: string;
  readonly grandTotal?: number | null;
  readonly description?: string | null;
  readonly receiptImageKey?: string | null;
  readonly lineItems?: (LineItem | null)[] | null;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyExpense = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Expense, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly userId: string;
  readonly date: string;
  readonly vendor: string;
  readonly grandTotal?: number | null;
  readonly description?: string | null;
  readonly receiptImageKey?: string | null;
  readonly lineItems: AsyncCollection<LineItem>;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Expense = LazyLoading extends LazyLoadingDisabled ? EagerExpense : LazyExpense

export declare const Expense: (new (init: ModelInit<Expense>) => Expense) & {
  copyOf(source: Expense, mutator: (draft: MutableModel<Expense>) => MutableModel<Expense> | void): Expense;
}

type EagerLineItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LineItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly expenseID: string;
  readonly item?: string | null;
  readonly category?: string | null;
  readonly quantity?: number | null;
  readonly unitCost?: number | null;
  readonly lineTotal?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLineItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LineItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly expenseID: string;
  readonly item?: string | null;
  readonly category?: string | null;
  readonly quantity?: number | null;
  readonly unitCost?: number | null;
  readonly lineTotal?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LineItem = LazyLoading extends LazyLoadingDisabled ? EagerLineItem : LazyLineItem

export declare const LineItem: (new (init: ModelInit<LineItem>) => LineItem) & {
  copyOf(source: LineItem, mutator: (draft: MutableModel<LineItem>) => MutableModel<LineItem> | void): LineItem;
}

type EagerIncome = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Income, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly userId: string;
  readonly date: string;
  readonly quantity: number;
  readonly price: number;
  readonly paymentMethod?: string | null;
  readonly amount: number;
  readonly item?: string | null;
  readonly notes?: string | null;
  readonly user?: User | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyIncome = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Income, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly userId: string;
  readonly date: string;
  readonly quantity: number;
  readonly price: number;
  readonly paymentMethod?: string | null;
  readonly amount: number;
  readonly item?: string | null;
  readonly notes?: string | null;
  readonly user: AsyncItem<User | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Income = LazyLoading extends LazyLoadingDisabled ? EagerIncome : LazyIncome

export declare const Income: (new (init: ModelInit<Income>) => Income) & {
  copyOf(source: Income, mutator: (draft: MutableModel<Income>) => MutableModel<Income> | void): Income;
}

type EagerField = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Field, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name: string;
  readonly acres?: number | null;
  readonly notes?: string | null;
  readonly livestock?: (Livestock | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyField = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Field, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name: string;
  readonly acres?: number | null;
  readonly notes?: string | null;
  readonly livestock: AsyncCollection<Livestock>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Field = LazyLoading extends LazyLoadingDisabled ? EagerField : LazyField

export declare const Field: (new (init: ModelInit<Field>) => Field) & {
  copyOf(source: Field, mutator: (draft: MutableModel<Field>) => MutableModel<Field> | void): Field;
}

type EagerLivestock = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Livestock, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name?: string | null;
  readonly species: string;
  readonly breed?: string | null;
  readonly birthdate?: string | null;
  readonly weight?: number | null;
  readonly gender?: string | null;
  readonly fieldID?: string | null;
  readonly location?: Field | null;
  readonly parents?: (LivestockFamily | null)[] | null;
  readonly children?: (LivestockFamily | null)[] | null;
  readonly medicalRecords?: (MedicalRecord | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLivestock = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<Livestock, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name?: string | null;
  readonly species: string;
  readonly breed?: string | null;
  readonly birthdate?: string | null;
  readonly weight?: number | null;
  readonly gender?: string | null;
  readonly fieldID?: string | null;
  readonly location: AsyncItem<Field | undefined>;
  readonly parents: AsyncCollection<LivestockFamily>;
  readonly children: AsyncCollection<LivestockFamily>;
  readonly medicalRecords: AsyncCollection<MedicalRecord>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Livestock = LazyLoading extends LazyLoadingDisabled ? EagerLivestock : LazyLivestock

export declare const Livestock: (new (init: ModelInit<Livestock>) => Livestock) & {
  copyOf(source: Livestock, mutator: (draft: MutableModel<Livestock>) => MutableModel<Livestock> | void): Livestock;
}

type EagerLivestockFamily = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LivestockFamily, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly parentID: string;
  readonly childID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyLivestockFamily = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<LivestockFamily, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly parentID: string;
  readonly childID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type LivestockFamily = LazyLoading extends LazyLoadingDisabled ? EagerLivestockFamily : LazyLivestockFamily

export declare const LivestockFamily: (new (init: ModelInit<LivestockFamily>) => LivestockFamily) & {
  copyOf(source: LivestockFamily, mutator: (draft: MutableModel<LivestockFamily>) => MutableModel<LivestockFamily> | void): LivestockFamily;
}

type EagerMedicalRecord = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MedicalRecord, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly livestockID: string;
  readonly type: string;
  readonly notes?: string | null;
  readonly date?: string | null;
  readonly medicine?: string | null;
  readonly livestock?: Livestock | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly livestockMedicalRecordsId?: string | null;
}

type LazyMedicalRecord = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<MedicalRecord, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly livestockID: string;
  readonly type: string;
  readonly notes?: string | null;
  readonly date?: string | null;
  readonly medicine?: string | null;
  readonly livestock: AsyncItem<Livestock | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly livestockMedicalRecordsId?: string | null;
}

export declare type MedicalRecord = LazyLoading extends LazyLoadingDisabled ? EagerMedicalRecord : LazyMedicalRecord

export declare const MedicalRecord: (new (init: ModelInit<MedicalRecord>) => MedicalRecord) & {
  copyOf(source: MedicalRecord, mutator: (draft: MutableModel<MedicalRecord>) => MutableModel<MedicalRecord> | void): MedicalRecord;
}

type EagerChickenFlock = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChickenFlock, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly breed: string;
  readonly count: number;
  readonly hasRooster?: boolean | null;
  readonly eggLogs?: (EggLog | null)[] | null;
  readonly notes?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyChickenFlock = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<ChickenFlock, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly breed: string;
  readonly count: number;
  readonly hasRooster?: boolean | null;
  readonly eggLogs: AsyncCollection<EggLog>;
  readonly notes?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type ChickenFlock = LazyLoading extends LazyLoadingDisabled ? EagerChickenFlock : LazyChickenFlock

export declare const ChickenFlock: (new (init: ModelInit<ChickenFlock>) => ChickenFlock) & {
  copyOf(source: ChickenFlock, mutator: (draft: MutableModel<ChickenFlock>) => MutableModel<ChickenFlock> | void): ChickenFlock;
}

type EagerEggLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<EggLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly date: string;
  readonly eggsCollected: number;
  readonly chickenFlockID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chickenFlockEggLogsId?: string | null;
}

type LazyEggLog = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<EggLog, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly date: string;
  readonly eggsCollected: number;
  readonly chickenFlockID: string;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  readonly chickenFlockEggLogsId?: string | null;
}

export declare type EggLog = LazyLoading extends LazyLoadingDisabled ? EagerEggLog : LazyEggLog

export declare const EggLog: (new (init: ModelInit<EggLog>) => EggLog) & {
  copyOf(source: EggLog, mutator: (draft: MutableModel<EggLog>) => MutableModel<EggLog> | void): EggLog;
}

type EagerInventoryItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<InventoryItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name: string;
  readonly type: string;
  readonly quantity?: number | null;
  readonly location?: string | null;
  readonly acquiredDate?: string | null;
  readonly notes?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyInventoryItem = {
  readonly [__modelMeta__]: {
    identifier: ManagedIdentifier<InventoryItem, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly sub: string;
  readonly name: string;
  readonly type: string;
  readonly quantity?: number | null;
  readonly location?: string | null;
  readonly acquiredDate?: string | null;
  readonly notes?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type InventoryItem = LazyLoading extends LazyLoadingDisabled ? EagerInventoryItem : LazyInventoryItem

export declare const InventoryItem: (new (init: ModelInit<InventoryItem>) => InventoryItem) & {
  copyOf(source: InventoryItem, mutator: (draft: MutableModel<InventoryItem>) => MutableModel<InventoryItem> | void): InventoryItem;
}