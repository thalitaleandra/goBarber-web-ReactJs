import React, { useCallback, useRef, ChangeEvent } from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft, FiCamera } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors'
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { Form } from '@unform/web'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'; //importando tudo de dentro do yup
import { Container, Content, AvatarInput } from './styles'
import Button from '../../components/Button/index'
import Input from '../../components/input/index'
import { useAuth } from '../../hooks/auth';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const { user, updateUser } = useAuth()
  const handleSubmit = useCallback(async (data: ProfileFormData) => {
    try {
      formRef.current ?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório.'),
        email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido.'),
        old_password: Yup.string(),
        password: Yup.string().when('old_password', {
          is: val => !!val.length,
          then: Yup.string().required('Campo Obrigatório'),
          otherwise: Yup.string(),
        }),
        password_confirmation:
          Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo Obrigatório'),
            otherwise: Yup.string(),
          }).oneOf(
            [Yup.ref('password'), undefined],
            'Confirmação incorreta',
          )
      });
      await schema.validate(data, {
        abortEarly: false, // aborda todos os erros de uma vez só
      });

      const { name, email, old_password, password, password_confirmation } = data;
      const formData = {
        name,
        email,
        ...(old_password ?
          {
            old_password,
            password,
            password_confirmation
          } : {}),
      }
      const response = await api.put('/profile', formData);
      updateUser(response.data);
      history.push('/dashboard');
      addToast({
        type: 'sucess',
        title: 'Perfil Atualizado',
        description: 'Suas informações do perfil foram atualizadas com sucesso!',
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current ?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro no atualização',
        description: 'Ocorreu um erro ao atualizar perfil, tente novamente',
      });
    }
  }, [addToast, history]);

  const handleAvatarChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const data = new FormData();

      data.append('avatar', e.target.files[0]);

      api.patch('/users/avatar', data).then((response) => {
        updateUser(response.data);
        addToast({
          type: 'sucess',
          title: 'Avatar atualizado'
        });
      });
    }

  }, [addToast, updateUser])
  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form ref={formRef} initialData={{
          name: user.name,
          email: user.email
        }} onSubmit={handleSubmit}>
          <AvatarInput>
            <img
              src={user.avatar_url}
              alt={user.name}
            />
            <label htmlFor="avatar">
              <FiCamera />
              <input type="file"
                id="avatar"
                onChange={handleAvatarChange}
              />
            </label>
          </AvatarInput>
          <h1>Meu perfil</h1>

          <Input name="name" icon={FiUser} placeholder="Nome"></Input>
          <Input name="email" icon={FiMail} placeholder="Email"></Input>
          <Input containerStyle={{ marginTop: 24 }} name="old_password" icon={FiLock} type="password" placeholder="Senha Atual"></Input>
          <Input name="password" icon={FiLock} type="password" placeholder="Nova Senha"></Input>
          <Input name="password_confirmation" icon={FiLock} type="password" placeholder="Confirmar Senha"></Input>


          <Button type="submit">Confirmar Mudanças</Button>

        </Form>


      </Content>



    </Container>
  )
}

export default Profile;
