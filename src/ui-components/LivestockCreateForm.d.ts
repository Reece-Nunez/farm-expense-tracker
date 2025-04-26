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
export declare type LivestockCreateFormInputValues = {
    sub?: string;
    name?: string;
    species?: string;
    breed?: string;
    birthdate?: string;
    weight?: number;
    gender?: string;
    status?: string;
    notes?: string;
};
export declare type LivestockCreateFormValidationValues = {
    sub?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    species?: ValidationFunction<string>;
    breed?: ValidationFunction<string>;
    birthdate?: ValidationFunction<string>;
    weight?: ValidationFunction<number>;
    gender?: ValidationFunction<string>;
    status?: ValidationFunction<string>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LivestockCreateFormOverridesProps = {
    LivestockCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    species?: PrimitiveOverrideProps<TextFieldProps>;
    breed?: PrimitiveOverrideProps<TextFieldProps>;
    birthdate?: PrimitiveOverrideProps<TextFieldProps>;
    weight?: PrimitiveOverrideProps<TextFieldProps>;
    gender?: PrimitiveOverrideProps<TextFieldProps>;
    status?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LivestockCreateFormProps = React.PropsWithChildren<{
    overrides?: LivestockCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: LivestockCreateFormInputValues) => LivestockCreateFormInputValues;
    onSuccess?: (fields: LivestockCreateFormInputValues) => void;
    onError?: (fields: LivestockCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LivestockCreateFormInputValues) => LivestockCreateFormInputValues;
    onValidate?: LivestockCreateFormValidationValues;
} & React.CSSProperties>;
export default function LivestockCreateForm(props: LivestockCreateFormProps): React.ReactElement;
