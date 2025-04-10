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
export declare type FieldCreateFormInputValues = {
    sub?: string;
    name?: string;
    acres?: number;
    notes?: string;
};
export declare type FieldCreateFormValidationValues = {
    sub?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    acres?: ValidationFunction<number>;
    notes?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type FieldCreateFormOverridesProps = {
    FieldCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    sub?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    acres?: PrimitiveOverrideProps<TextFieldProps>;
    notes?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type FieldCreateFormProps = React.PropsWithChildren<{
    overrides?: FieldCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: FieldCreateFormInputValues) => FieldCreateFormInputValues;
    onSuccess?: (fields: FieldCreateFormInputValues) => void;
    onError?: (fields: FieldCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: FieldCreateFormInputValues) => FieldCreateFormInputValues;
    onValidate?: FieldCreateFormValidationValues;
} & React.CSSProperties>;
export default function FieldCreateForm(props: FieldCreateFormProps): React.ReactElement;
