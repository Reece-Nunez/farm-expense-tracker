/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Livestock } from "../models";
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
export declare type LivestockUpdateFormInputValues = {
    name?: string;
    species?: string;
    breed?: string;
    birthdate?: string;
    weight?: number;
    gender?: string;
};
export declare type LivestockUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    species?: ValidationFunction<string>;
    breed?: ValidationFunction<string>;
    birthdate?: ValidationFunction<string>;
    weight?: ValidationFunction<number>;
    gender?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type LivestockUpdateFormOverridesProps = {
    LivestockUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    species?: PrimitiveOverrideProps<TextFieldProps>;
    breed?: PrimitiveOverrideProps<TextFieldProps>;
    birthdate?: PrimitiveOverrideProps<TextFieldProps>;
    weight?: PrimitiveOverrideProps<TextFieldProps>;
    gender?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type LivestockUpdateFormProps = React.PropsWithChildren<{
    overrides?: LivestockUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    livestock?: Livestock;
    onSubmit?: (fields: LivestockUpdateFormInputValues) => LivestockUpdateFormInputValues;
    onSuccess?: (fields: LivestockUpdateFormInputValues) => void;
    onError?: (fields: LivestockUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: LivestockUpdateFormInputValues) => LivestockUpdateFormInputValues;
    onValidate?: LivestockUpdateFormValidationValues;
} & React.CSSProperties>;
export default function LivestockUpdateForm(props: LivestockUpdateFormProps): React.ReactElement;
