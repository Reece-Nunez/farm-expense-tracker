/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type InventoryItemUpdateFormInputValues = {
    sub?: string;
    name?: string;
    type?: string;
    quantity?: number;
    location?: string;
    acquiredDate?: string;
    notes?: string;
};
export declare type InventoryItemUpdateFormValidationValues = {
    sub?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    type?: ValidationFunction<string>;
    quantity?: ValidationFunction<number>;
    location?: ValidationFunction<string>;
    acquiredDate?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InventoryItemUpdateFormOverridesProps = {
    InventoryItemUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    type?: PrimitiveOverrideProps<TextFieldProps>;
    quantity?: PrimitiveOverrideProps<TextFieldProps>;
    location?: PrimitiveOverrideProps<TextFieldProps>;
    acquiredDate?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InventoryItemUpdateFormProps = React.PropsWithChildren<{
    overrides?: InventoryItemUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    inventoryItem?: any;
    onSubmit?: (fields: InventoryItemUpdateFormInputValues) => InventoryItemUpdateFormInputValues;
    onSuccess?: (fields: InventoryItemUpdateFormInputValues) => void;
    onError?: (fields: InventoryItemUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InventoryItemUpdateFormInputValues) => InventoryItemUpdateFormInputValues;
    onValidate?: InventoryItemUpdateFormValidationValues;
} & React.CSSProperties>;
export default function InventoryItemUpdateForm(props: InventoryItemUpdateFormProps): React.ReactElement;
