"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';

const Schema = z.object({
  idEstudiante: z.number().int().nonnegative(),
  idGrupoMateria: z.number().int().nonnegative(),
  fechaInscripcion: z.string().min(1),
  estado: z.string().min(1),
});

type FormValues = z.infer<typeof Schema>;

export default function InscripcionModal({ open, onClose, initial }: { open: boolean; onClose: () => void; initial?: Partial<FormValues> }) {
  const form = useForm<FormValues>({ resolver: zodResolver(Schema), defaultValues: {
    idEstudiante: initial?.idEstudiante ?? 0,
    idGrupoMateria: initial?.idGrupoMateria ?? 0,
    fechaInscripcion: initial?.fechaInscripcion ?? new Date().toISOString(),
    estado: initial?.estado ?? 'Activo',
  }});

  const onSubmit = async (data: FormValues) => {
    // Aquí llamaría a tu API real. Por ahora sólo log y cerrar.
    console.log('Inscribir payload', data);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Inscribir estudiante</DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Estudiante</label>
            <Input type="number" {...form.register('idEstudiante', { valueAsNumber: true })} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Grupo Materia</label>
            <Input type="number" {...form.register('idGrupoMateria', { valueAsNumber: true })} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha Inscripción</label>
            <Input type="datetime-local" {...form.register('fechaInscripcion')} className="mt-1" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Estado</label>
            <Input {...form.register('estado')} className="mt-1" />
          </div>

          <DialogFooter>
            <div className="flex gap-2 justify-end w-full">
              <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
