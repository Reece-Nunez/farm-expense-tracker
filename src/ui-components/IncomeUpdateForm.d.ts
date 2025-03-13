/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Income } from "../models";
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
export declare type IncomeUpdateFormInputValues = {
    userId?: string;
    date?: string;
    quantity?: number;
    price?: number;
    paymentMethod?: string;
    amount?: number;
    item?: string;
    notes?: string;
};
export declare type IncomeUpdateFormValidationValues = {
    userId?: ValidationFunction<string>;
    date?: ValidationFunction<string>;
    quantity?: ValidationFunction<number>;
    price?: ValidationFunction<number>;
    paymentMethod?: ValidationFunction<string>;
    amount?: ValidationFunction<number>;
    item?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type IncomeUpdateFormOverridesProps = {
    IncomeUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    userId?: PrimitiveOverrideProps<TextFieldProps>;
    date?: PrimitiveOverrideProps<TextFieldProps>;
    quantity?: PrimitiveOverrideProps<TextFieldProps>;
    price?: PrimitiveOverrideProps<TextFieldProps>;
    paymentMethod?: PrimitiveOverrideProps<TextFieldProps>;
    amount?: PrimitiveOverrideProps<TextFieldProps>;
    item?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type IncomeUpdateFormProps = React.PropsWithChildren<{
    overrides?: IncomeUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    income?: Income;
    onSubmit?: (fields: IncomeUpdateFormInputValues) => IncomeUpdateFormInputValues;
    onSuccess?: (fields: IncomeUpdateFormInputValues) => void;
    onError?: (fields: IncomeUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: IncomeUpdateFormInputValues) => IncomeUpdateFormInputValues;
    onValidate?: IncomeUpdateFormValidationValues;
} & React.CSSProperties>;
export default function IncomeUpdateForm(props: IncomeUpdateFormProps): React.ReactElement;
